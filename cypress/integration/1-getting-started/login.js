/// <reference types="cypress" />

describe("app navigate", () => {
  it("go login page", function () {
    cy.visit("http://localhost:4200/login");
    cy.get(".username_input").type("test");
    cy.get(".password_input").type("test");
    cy.contains("Login").click();
  });

  it("download file", function () {
    cy.get(
      ":nth-child(2) > .mat-list-item-content > .mat-focus-indicator > .mat-button-wrapper > .mat-icon"
    ).click();
  });

  it("Logout", function () {
    cy.contains("Logout").click();
  });
});
