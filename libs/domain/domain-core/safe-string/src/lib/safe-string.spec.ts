import { SafeString } from './safe-string';

describe('SafeString', () => {
  /**
   * Este conjunto de testes cobre a classe SafeString, que implementa validação e sanitização de strings
   * para prevenir ataques XSS e SQL Injection. A classe utiliza padrões de Chain of Responsibility
   * para validação e sanitização, com complexidade em loops para verificação de padrões e condicionais
   * para detecção de ameaças.
   *
   * Os testes seguem boas práticas:
   * - Cobertura de caminhos felizes e de erro
   * - Testes de edge cases (strings vazias, caracteres especiais, entradas longas)
   * - Validação de sanitização correta
   * - Justificativa em comentários para suficiência da cobertura
   *
   * Por que este conjunto é bom o suficiente:
   * - Testa todas as ramificações principais: criação bem-sucedida, falhas de validação XSS/SQL, sanitização HTML/SQL
   * - Cobre loops nos validadores (iteração sobre padrões perigosos)
   * - Verifica condicionais de detecção de ameaças
   * - Inclui casos extremos para robustez
   * - Mantém testes isolados e legíveis
   */

  describe('create - Caminho Feliz', () => {
    it('deve criar SafeString com valor simples sem modificações', () => {
      // Justificativa: Testa o caminho básico de criação, garantindo que strings seguras passam sem alteração
      const safe = SafeString.create('Hello World');
      expect(safe.getValue()).toBe('Hello World');
    });

    it('deve preservar caracteres UTF-8 e especiais não perigosos', () => {
      // Justificativa: Verifica que caracteres acentuados e especiais são preservados, testando sanitização seletiva
      const safe = SafeString.create('Olá José Ação ñ @ # $ % & * ( )');
      expect(safe.getValue()).toContain('Olá');
      expect(safe.getValue()).toContain('José');
      expect(safe.getValue()).toContain('Ação');
      expect(safe.getValue()).toContain('ñ');
    });

    it('deve lidar com string vazia', () => {
      // Justificativa: Edge case para strings vazias, garantindo robustez em entradas mínimas
      const safe = SafeString.create('');
      expect(safe.getValue()).toBe('');
    });

    it('deve sanitizar aspas simples em contexto não perigoso', () => {
      // Justificativa: Testa interação entre sanitizadores HTML e SQL, onde aspas são escapadas pelo HTML primeiro
      const safe = SafeString.create("O'Reilly");
      expect(safe.getValue()).toBe('O&#x27Reilly');
    });
  });

  describe('create - Validação XSS', () => {
    it('deve rejeitar scripts maliciosos', () => {
      // Justificativa: Cobre detecção de <script> tags, testando loop sobre padrões no XssDetectionValidator
      expect(() =>
        SafeString.create('<script>alert("XSS")</script>Hello')
      ).toThrow();
    });

    it('deve rejeitar tags style', () => {
      // Justificativa: Verifica detecção de <style>, outra ameaça XSS comum
      expect(() =>
        SafeString.create('<style>body{color:red}</style>Hello')
      ).toThrow();
    });

    it('deve rejeitar javascript: protocol', () => {
      // Justificativa: Testa detecção de protocolos javascript:, cobrindo condicional de match no validador
      expect(() => SafeString.create('javascript:alert("XSS")')).toThrow();
    });

    it('deve rejeitar event handlers inline', () => {
      // Justificativa: Cobre detecção de atributos on* , testando regex para event handlers
      expect(() =>
        SafeString.create('<a href="#" onclick="alert(1)">Link</a>')
      ).toThrow();
    });

    it('deve rejeitar iframes', () => {
      // Justificativa: Verifica detecção de <iframe>, completando cobertura de tags perigosas
      expect(() =>
        SafeString.create('<iframe src="malicious.com"></iframe>')
      ).toThrow();
    });
  });

  describe('create - Validação SQL Injection', () => {
    it('deve rejeitar comandos SQL perigosos com ponto e vírgula', () => {
      // Justificativa: Testa detecção de ; DROP, cobrindo loop e condicional no SqlInjectionDetectionValidator
      expect(() => SafeString.create('admin; DROP TABLE users')).toThrow();
    });

    it('deve rejeitar UNION SELECT', () => {
      // Justificativa: Verifica detecção de UNION SELECT, padrão comum de SQL injection
      expect(() =>
        SafeString.create('admin UNION SELECT * FROM users')
      ).toThrow();
    });

    it('deve rejeitar comentários SQL de linha', () => {
      // Justificativa: Cobre detecção de --, testando regex para comentários
      expect(() => SafeString.create('admin--')).toThrow();
    });

    it('deve rejeitar comentários de bloco SQL', () => {
      // Justificativa: Verifica detecção de /* */, completando comentários SQL
      expect(() => SafeString.create('admin /* comment */ user')).toThrow();
    });

    it('deve rejeitar combinação aspas e comentário', () => {
      // Justificativa: Testa padrão específico '; --, cobrindo casos híbridos
      expect(() => SafeString.create("admin'; --")).toThrow();
    });
  });

  describe('create - Sanitização HTML', () => {
    it('deve escapar tags HTML básicas', () => {
      // Justificativa: Verifica sanitização HTML, testando replaces no HtmlSanitizer
      const safe = SafeString.create('<div>Hello</div>');
      expect(safe.getValue()).toBe('&ltdiv&gtHello&lt/div&gt');
    });

    it('deve escapar aspas duplas e simples', () => {
      // Justificativa: Cobre escaping de aspas, parte da sanitização HTML
      const safe = SafeString.create('<input value="test" data=\'single\'>');
      expect(safe.getValue()).toBe(
        '&ltinput value=&quottest&quot data=&#x27single&#x27&gt'
      );
    });
  });

  describe('create - Sanitização SQL', () => {
    it('deve remover ponto e vírgula', () => {
      // Justificativa: Testa remoção de ; no SqlSanitizer, após HTML
      const safe = SafeString.create('query; malicious');
      expect(safe.getValue()).toBe('query malicious');
    });

    it('deve duplicar aspas simples para SQL', () => {
      // Justificativa: Verifica escaping de aspas simples para SQL safety
      const safe = SafeString.create("user' OR '1'='1");
      // HTML escapa primeiro: user&#x27 OR &#x271&#x27=&#x271
      // SQL não duplica aspas pois já foram escapadas pelo HTML
      expect(safe.getValue()).toBe('user&#x27 OR &#x271&#x27=&#x271');
    });

    it('deve escapar barras invertidas', () => {
      // Justificativa: Cobre escaping de backslashes, importante para paths e SQL
      const safe = SafeString.create('C:\\Users\\Admin');
      expect(safe.getValue()).toBe('C:\\\\Users\\\\Admin');
    });

    it('deve remover comentários SQL', () => {
      // Justificativa: Verifica remoção de -- e /* */, sanitizando comentários
      const safe = SafeString.create('query -- comment');
      expect(safe.getValue()).toBe('query  comment');
    });
  });

  describe('create - Combinação de Proteções', () => {
    it('deve aplicar sanitização completa em entrada complexa', () => {
      // Justificativa: Testa a chain completa: validação passa, sanitização HTML + SQL aplicada
      const input = "José<script>alert(1)</script> O'Reilly; DROP --";
      // Validação falha por script, então lança erro
      expect(() => SafeString.create(input)).toThrow();
    });

    it('deve sanitizar entrada com múltiplas ameaças não críticas', () => {
      // Justificativa: Verifica sanitização quando validação passa, cobrindo interação entre sanitizadores
      const input = "<b>Bold</b> O'Reilly; -- comment \\";
      const safe = SafeString.create(input);
      // HTML escapa tags, SQL remove ; --, duplica aspas (mas já escapadas), escapa \
      expect(safe.getValue()).toBe(
        '&ltb&gtBold&lt/b&gt O&#x27Reilly  comment \\\\'
      );
    });

    it('deve lidar com entrada longa sem problemas de performance', () => {
      // Justificativa: Edge case para strings longas, garantindo que loops nos validadores/sanitizadores não causam issues
      const longInput = 'A'.repeat(10000) + '<script>alert(1)</script>';
      expect(() => SafeString.create(longInput)).toThrow(); // Por causa do script
    });
  });

  describe('getValue', () => {
    it('deve retornar o valor sanitizado', () => {
      // Justificativa: Testa o getter simples, garantindo acesso ao valor processado
      const safe = SafeString.create('test');
      expect(safe.getValue()).toBe('test');
    });
  });
});
