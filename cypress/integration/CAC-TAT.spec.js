/// <reference types="Cypress" />

describe("Central de Atendimento ao Cliente TAT", function () {
  const THREE_SECONDS_IN_MS = 3000;

  beforeEach(function () {
    cy.visit("./src/index.html");
  });

  it("verifica o título da aplicação", function () {
    cy.title().should("be.equal", "Central de Atendimento ao Cliente TAT");
  });

  it("Preenche os campos obrigatórios e envia o formulário", function () {
    const longText =
      "Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste";

    cy.clock(); //para o relógio do navegador

    cy.get("#firstName").type("Bruno");
    cy.get("#lastName").type("Destefani");
    cy.get("#email").type("bruno@bruno.com");
    cy.get("#open-text-area").type(longText, { delay: 0 }); //sobrescreve o delay default da propriedade type para 0
    // cy.get('button[type="submit"]').click();
    cy.contains("button", "Enviar").click();
    cy.get(".success").should("be.visible");

    cy.tick(THREE_SECONDS_IN_MS); //avança no tempo

    cy.get(".success").should("not.be.visible");
  });

  it("Exibe mensagem de erro ao submeter o formulário com um email com formatação inválida", function () {
    cy.clock(); //para o relógio do navegador

    cy.get("#email").type("bruno");
    // cy.get('button[type="submit"]').click();
    cy.contains("button", "Enviar").click();
    cy.get(".error").should("be.visible");

    cy.tick(THREE_SECONDS_IN_MS); //avança no tempo

    cy.get(".error").should("not.be.visible");
  });

  it("Verificar se campo de telefone aceita valor não numérico", function () {
    cy.get("#phone").type("abc").should("have.value", "");
  });

  it("Exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio", function () {
    cy.clock(); //para o relógio do navegador

    cy.get("#phone-checkbox").check().should("be.checked");
    // cy.get('button[type="submit"]').click();
    cy.contains("button", "Enviar").click();
    cy.get(".error").should("be.visible");

    cy.tick(THREE_SECONDS_IN_MS); //avança no tempo

    cy.get(".error").should("not.be.visible");
  });

  it("Preenche e limpa os campos nome, sobrenome, email e telefone", function () {
    cy.get("#firstName")
      .type("Bruno")
      .should("have.value", "Bruno")
      .clear()
      .should("have.value", "");

    cy.get("#lastName")
      .type("Destefani")
      .should("have.value", "Destefani")
      .clear()
      .should("have.value", "");

    cy.get("#email")
      .type("bruno@bruno.com")
      .should("have.value", "bruno@bruno.com")
      .clear()
      .should("have.value", "");

    cy.get("#phone")
      .type("1199999999")
      .should("have.value", "1199999999")
      .clear()
      .should("have.value", "");

    cy.get("#open-text-area")
      .type("Digitando na textArea")
      .should("have.value", "Digitando na textArea")
      .clear()
      .should("have.value", "");
  });

  it("Exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios", function () {
    cy.clock(); //para o relógio do navegador

    // cy.get('button[type="submit"]').click();
    cy.contains("button", "Enviar").click();
    cy.get(".error").should("be.visible");

    cy.tick(THREE_SECONDS_IN_MS); //avança no tempo

    cy.get(".error").should("not.be.visible");
  });

  it("Envia um formulário com sucesso usando um comando customizado", function () {
    cy.clock(); //para o relógio do navegador

    cy.fillMandatoryFieldsAndSubmit(); // /support/commands.js
    cy.get(".success").should("be.visible");

    cy.tick(THREE_SECONDS_IN_MS); //avança no tempo

    cy.get(".success").should("not.be.visible");
  });

  it("selecionar um produto (YouTube) pelo texto", function () {
    cy.get("#product")
      .select("YouTube") //texto ou #id
      .should("have.value", "youtube"); //#id
  });

  it("selecionar um produto (Mentoria) pelo valur (value)", function () {
    cy.get("#product").select("mentoria").should("have.value", "mentoria");
  });

  it("selecionar um produto (Mentoria) pelo valur (value)", function () {
    cy.get("#product").select(1).should("have.value", "blog");
  });

  it('marca o tipo de atendimento "Feedback', () => {
    cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should("be.checked");
  });

  it("marca cada tipo de atendimento", () => {
    cy.get('input[type="radio"]')
      .should("have.length", 3)
      .each(function ($radio) {
        cy.wrap($radio).check(); //cy.wrap "empacota" todas as opções
        cy.wrap($radio).should("be.checked");
      });
  });

  it("marca ambos checkboxes, depois desmarca o último", () => {
    cy.get('input[type="checkbox"]')
      .check()
      .should("be.checked")
      .last()
      .uncheck()
      .should("not.be.checked");
  });

  it("seleciona um arquivo da pasta fixtures", () => {
    cy.get('input[type="file"]#file-upload')
      .should("not.have.value")
      .selectFile("cypress/fixtures/example.json");
  });

  it("seleciona um arquivo simulando um drag-and-drop", () => {
    cy.get('input[type="file"]#file-upload')
      .should("not.have.value")
      .selectFile("cypress/fixtures/example.json", { action: "drag-drop" });
  });

  it("seleciona um arquivo utilizando uma fixture para a qual foi dada um alias", () => {
    cy.fixture("example.json").as("sampleFile"); //não precisa passar o caminho inteiro, passa o cy.fixture e da um alias para o arquivo
    cy.get('input[type="file"]').selectFile("@sampleFile");
  });

  it("verifica que a política de privacidade abre em outra aba sem a necessidade de um clique", () => {
    cy.get("#privacy a").should("have.attr", "target", "_blank"); //verifica se tem o atributo "_blank"
  });

  it("acessa a página da política de privacidade removendo o target e clicando no link", () => {
    cy.get("#privacy a")
      .invoke("removeAttr", "target") // remove o atributo _blank
      .click();

    cy.contains("Talking About Testing").should("be.visible");
  });

  it("exibe e esconde as mensagens de sucesso e erro usando o .invoke", () => {
    cy.get(".success")
      .should("not.be.visible")
      .invoke("show")
      .should('be.visible')
      .and("contain", "Mensagem enviada com sucesso.")
      .invoke("hide")
      .should("not.be.visible");
    cy.get(".error")
      .should("not.be.visible")
      .invoke("show")
      .should("be.visible")
      .and("contain", "Valide os campos obrigatórios!")
      .invoke("hide")
      .should("not.be.visible");
  });

  it("preenche a área de texto usando o comando invoke", () => {
    const longText = Cypress._.repeat('0123456789', 20) //declara na variável o valor 20 vezes
    cy.get('#open-text-area')
      .invoke('val', longText)
      .should('have.value', longText)
  })

  it('faz uma requisição HTTP', () => {
    cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
      .should(function(response) {
        const { status, statusText, body } = response
        expect(status).to.equal(200)
        expect(statusText).to.equal('OK')
        expect(body).to.include('CAC TAT')
      })
  })

  it.only('encontra o gato escondido', () => {
    cy.get('#cat')
      .invoke('show')
      .should('be.visible')
  })




});
