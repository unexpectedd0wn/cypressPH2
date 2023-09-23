export class Login{
    
    elements =
        {
            loginBtn : () => cy.get('#singin-btn'),
            emailTxt : () => cy.get('#email'),
            passwordTxt : () => cy.get('#password'),
        }


    clickOnLogin()
    {
        this.elements.loginBtn().click({force: true});
        
    }
    typeEmail(password)
    {
        this.elements.emailTxt().clear().type(password);
    }
    typePassword(email)
    {
        this.elements.passwordTxt().clear().type(email);
    }
}

export const LoginPage = new Login();
