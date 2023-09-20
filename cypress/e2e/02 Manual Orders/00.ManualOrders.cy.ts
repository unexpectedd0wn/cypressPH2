import { Wholesalers } from "../../support/enums";
import { APIRequests } from "../../page-objects/api-routes";
import {
  getItemForTest,
  toCheckOrderDetails,
  toCheckOrderHistory,
  searchItemOnPage,
  toAddItemToTheShoppingCart,
  checkCartTab,
  setQty,
  placeOrder,
} from "../../service/manualOrderService";
import { sql } from "../../service/sqlService";

const pharmacyId = Cypress.env("pharmacyId");


interface TestCase {
  page: string;
  wholesaler: string;
  pharmacy: string;
}

const testCase: TestCase[] = [
//   {
//     page: "Brokered Ethical",
//     wholesaler: Wholesalers.UD.Name,
//     pharmacy: pharmacyId,
//   },
//   {
//     page: "Brokered OTC",
//     wholesaler: Wholesalers.UD.Name,
//     pharmacy: pharmacyId,
//   },
//   {
//     page: "Second Line",
//     wholesaler: Wholesalers.UD.Name,
//     pharmacy: pharmacyId,
//   },
//   {
//     page: "Brokered Ethical",
//     wholesaler: Wholesalers.PCO.Name,
//     pharmacy: pharmacyId,
//   },
//   {
//     page: "Brokered OTC",
//     wholesaler: Wholesalers.PCO.Name,
//     pharmacy: pharmacyId,
//   },
//   {
//     page: "Brokered Ethical",
//     wholesaler: Wholesalers.IMED.Name,
//     pharmacy: pharmacyId,
//   },
//   {
//     page: "Brokered OTC",
//     wholesaler: Wholesalers.IMED.Name,
//     pharmacy: pharmacyId,
//   },
//   {
//     page: "Brokered Ethical",
//     wholesaler: Wholesalers.LEXON.Name,
//     pharmacy: pharmacyId,
//   },
//   {
//     page: "Brokered OTC",
//     wholesaler: Wholesalers.LEXON.Name,
//     pharmacy: pharmacyId,
//   },
//   {
//     page: "Brokered Ethical",
//     wholesaler: Wholesalers.ONEILLS.Name,
//     pharmacy: pharmacyId,
//   },
//   {
//     page: "Brokered OTC",
//     wholesaler: Wholesalers.ONEILLS.Name,
//     pharmacy: pharmacyId,
//   },
  {
    page: "ULM",
    wholesaler: Wholesalers.ONEILLS.Name,
    pharmacy: pharmacyId,
  },
];

describe("Manual Orders: United Drug", () => {
  before(() => {
    // cy.cleanUpShoppingCart(pharmacyId);
    sql.cleanUpShoppingCart(pharmacyId);
  });

  beforeEach(() => {
    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });
    cy.intercept("/api/stock-product/products?" + "*").as("pageLoaded");
    cy.intercept(APIRequests.request._filter_wholesaler + "*").as(
      "searchWholesaler"
    );
    cy.intercept(APIRequests.request._getShoppingCart + "*").as("shopingCart");
    cy.intercept(APIRequests.request._addItemShoppingCart).as("itemAdded");
    cy.intercept(APIRequests.request._sendOrder).as("sendorder");
    cy.intercept(APIRequests.request._getDataOrderHistoryPage).as(
      "orderHistory"
    );
    cy.intercept(
      "/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=IPUCode&filters%5B0%5D.value=*"
    ).as("search");
    cy.intercept(
      "/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=IPUCode&filters%5B0%5D.value=" +
        "*" +
        "&filters%5B0%5D.$type=string&filters%5B0%5D.matchMode=0&filters%5B1%5D.propertyName=wholesalerId&filters%5B1%5D.value=1&filters%5B1%5D.$type=number&filters%5B1%5D.matchMode=0&filters%5B2%5D.propertyName=" +
        "*" +
        "&filters%5B2%5D.value=true&filters%5B2%5D.$type=boolean"
    ).as("textSearchLoaded");

    cy.fixture("main").then((data) => {
      cy.signInCreateSession(data.pharmacyUserEmail, data.pharmacyUserPassword);
    });
  });

  afterEach(() => {
    cy.clearAllCookies();
  });

  for (const { page, wholesaler, pharmacy } of testCase) {
    it("Manual Order", () => {
      cy.visitPage(page);
      getItemForTest(wholesaler);
    
      cy.request('POST','https://pharmax2-test-windows.blueberrytest.com/api/stock-product/cart/add',
      {"StockProductId":27026,"Qty":1})
    //   searchItemOnPage();
    //   toAddItemToTheShoppingCart();
      checkCartTab(page, wholesaler);

      setQty(wholesaler);

      placeOrder(wholesaler, page);
      toCheckOrderDetails(pharmacy);

      cy.visitPage("Order History");
      toCheckOrderHistory(wholesaler);
    });
  }
});
