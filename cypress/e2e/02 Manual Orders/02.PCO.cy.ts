import { Wholesalers } from "../../support/enums";
import { APIRequests } from "../../page-objects/api-routes";
import { getItemForTest,toCheckOrderDetails, toCheckOrderHistory } from "../../service/manualOrderService";
import { checkCartTab, placeOrder, searchItemOnPage, setQty, toAddItemToTheShoppingCart } from "../../service/manualOrderService";
import { sql } from "../../service/sqlService";
const pharmacyId = Cypress.env("pharmacyId");



interface TestCase {
    page: string;
    wholesaler: string;
    pharmacy: string;
  }
  
  const testCase: TestCase[] = [
    {
      page: "Brokered Ethical",
      wholesaler: Wholesalers.PCO.Name,
      pharmacy: pharmacyId,
    },
    {
      page: "Brokered OTC",
      wholesaler: Wholesalers.PCO.Name,
      pharmacy: pharmacyId,
    },
  ];

describe('Manual Orders: PCO', () => {

    before(() => {
        sql.cleanUpShoppingCart(pharmacyId);
    });

    beforeEach(() => {
        cy.on('uncaught:exception', (err, runnable) => {
            return false
        })
        cy.intercept('/api/stock-product/products?' + '*').as('pageLoaded');
        cy.intercept(APIRequests.request._filter_wholesaler + '*').as('searchWholesaler')
        cy.intercept(APIRequests.request._getShoppingCart + '*').as('shopingCart')
        cy.intercept(APIRequests.request._addItemShoppingCart).as('itemAdded')
        cy.intercept(APIRequests.request._sendOrder).as('sendorder')
        cy.intercept(APIRequests.request._getDataOrderHistoryPage).as('orderHistory')
        cy.intercept('/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=IPUCode&filters%5B0%5D.value=*').as('search')
        cy.intercept('/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=IPUCode&filters%5B0%5D.value=' + '*' + '&filters%5B0%5D.$type=string&filters%5B0%5D.matchMode=0&filters%5B1%5D.propertyName=wholesalerId&filters%5B1%5D.value=1&filters%5B1%5D.$type=number&filters%5B1%5D.matchMode=0&filters%5B2%5D.propertyName=' + '*' + '&filters%5B2%5D.value=true&filters%5B2%5D.$type=boolean').as('textSearchLoaded')
        cy.fixture("main").then(data => {
            cy.signInCreateSession(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
    });

    afterEach(() => {
        // cy.signOut();
        cy.clearAllCookies();
    });

    for (const { page, wholesaler, pharmacy } of testCase) {
        it("Order 1 United Drug Item", () => {
          cy.visitPage(page);
          getItemForTest(wholesaler);
    
          searchItemOnPage();
          toAddItemToTheShoppingCart();
          checkCartTab(wholesaler);
    
          setQty(wholesaler);
    
          placeOrder(wholesaler);
          toCheckOrderDetails(pharmacy);
    
          cy.visitPage("Order History");
          toCheckOrderHistory(wholesaler);
        });
      }

    // it('Order 1 PCO  Item | Brokered Ethical', () => {
        
    //     cy.visitPage("Brokered Ethical");
    //     getItemForTest(wholesaler);
    //     addItemAndCheckCartTab(wholesaler);

    //     toPlaceTheOrder(wholesaler);
    //     toCheckOrderDetails(pharmacyId);

    //     cy.visitPage("Order History");
    //     toCheckOrderHistory(wholesaler);
    // });

    // it('Order 1 PCO Item | Brokered OTC', () => {

    //     cy.visitPage("Brokered OTC");
    //     getItemForTest(wholesaler);
    //     addItemAndCheckCartTab(wholesaler);

    //     toPlaceTheOrder(wholesaler);
    //     toCheckOrderDetails(pharmacyId);

    //     cy.visitPage("Order History");
    //     toCheckOrderHistory(wholesaler);

    // });

});
