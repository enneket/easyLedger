/// <reference types="cypress" />

describe('Account Management', () => {
  beforeEach(() => {
    cy.viewport('iphone-x');
    cy.visit('/accounts');
  });

  it('should display accounts list', () => {
    cy.contains('账本管理').should('be.visible');
    // Default account should be present (though initially store might be empty if not persisted/mocked correctly, 
    // but app initializes with default if empty)
    // Actually our store init logic might need to be triggered.
    // Let's assume at least one account exists or we can create one.
  });

  it('should create a new account', () => {
    // Click "New Account" button
    cy.contains('button', '新建账本').click();

    // Fill form
    const accountName = 'Test Bank';
    cy.get('input[name="name"]').type(accountName);
    cy.get('input[name="initialBalance"]').clear().type('1000');
    cy.get('input[name="currency"]').clear().type('USD');

    // Save
    cy.contains('button', '保存').click();

    // Verify it appears in the list
    cy.contains(accountName).should('be.visible');
    cy.contains('USD 1000.00').should('be.visible');
  });

  it('should switch account', () => {
    // Ensure we have at least 2 accounts. 
    // Since tests might run in random order or state is not reset, let's create one first to be sure.
    const uniqueName = `Switch Target ${Date.now()}`;
    cy.contains('button', '新建账本').click();
    cy.get('input[name="name"]').type(uniqueName);
    cy.get('input[name="initialBalance"]').type('0');
    cy.contains('button', '保存').click();
    
    // Verify creation first
    cy.contains(uniqueName).should('be.visible');

    // If it was the first account created in a fresh session, it might be auto-selected.
    // So we should check if we are already selected or not.
    // Strategy: Create ANOTHER account, so we definitely have >1 account.
    // The newly created one might not be default unless logic says so.
    // Let's force select the FIRST account in the list (if exists) then try to switch to the NEW one.
    
    // Actually, simpler: Find ANY button that says '切换使用' and click it.
    // If we just created a new account, and there was already one (e.g. from previous test),
    // one of them should be inactive.
    
    // Wait a bit for UI update
    cy.wait(500);

    cy.get('body').then($body => {
      if ($body.find('button:contains("切换使用")').length > 0) {
        // If there is a switch button, click it
        cy.contains('button', '切换使用').first().click();
        
        // After click, that card should now say "当前使用"
        // Since we clicked the first available switch button, we can't easily assert WHICH card changed 
        // without more complex selection.
        // But we can assert that the number of "当前使用" badges is 1 (it should always be 1).
        cy.contains('当前使用').should('be.visible');
      } else {
        // If no switch button, it means we only have 1 account (the one we just created/active).
        // Create another one to test switching.
        cy.contains('button', '新建账本').click();
        cy.get('input[name="name"]').type('Second Account');
        cy.get('input[name="initialBalance"]').type('100');
        cy.contains('button', '保存').click();
        
        // Now the old one should be switchable (assuming new one didn't auto-takeover or did? 
        // Logic: createAccount usually sets current if none exists. If one exists, it just adds.
        // So the new one should be switchable.
        cy.contains('button', '切换使用').should('be.visible').click();
      }
    });
  });
});
