/// <reference types="cypress" />

describe('Settings Page', () => {
  beforeEach(() => {
    cy.viewport('iphone-x');
    cy.visit('/settings');
  });

  it('should render settings sections', () => {
    cy.contains('h1', '设置').should('be.visible');
    cy.contains('h2', '账本管理').should('be.visible');
    cy.contains('h2', '分类概览').should('be.visible');
    cy.contains('h2', '数据管理').should('be.visible');
  });

  it('should show export/import options', () => {
    cy.contains('button', '导出数据').should('be.visible');
    cy.contains('button', '导入数据').should('be.visible');
    cy.contains('button', '清空所有数据').should('be.visible');
  });

  // Testing actual file download/upload in Cypress can be complex and might require plugins.
  // For now, we verify the UI elements are present.
});
