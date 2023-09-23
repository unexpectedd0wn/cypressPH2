import dayjs = require("dayjs");
import { Wholesalers } from "../../support/enums";
import { APIRequests } from "../../page-objects/api-routes";
import { ShoppingCart } from "../../page-objects/shopping-cart";
import { sql } from "../../service/sqlService";
import {
  toCheckOrderDetails,
  toCheckOrderHistory,
  placeOrder,
  getItemForTestBetter,
} from "../../service/manualOrderService";

const pharmacyId = Cypress.env("pharmacyId");
let currentDateTime = dayjs()
.subtract(2, "hour")
.format("YYYY-MM-DD HH:mm:ss:SSS");

interface TestCase {
  page: string;
  wholesaler: string;
  pharmacy: string;
}

const testCase: TestCase[] = [
  {
    page: "Brokered Ethical",
    wholesaler: Wholesalers.UD.Name,
    pharmacy: pharmacyId
  },
  {
    page: "Brokered OTC",
    wholesaler: Wholesalers.UD.Name,
    pharmacy: pharmacyId,
  },
  {
    page: "Second Line",
    wholesaler: Wholesalers.UD.Name,
    pharmacy: pharmacyId,
  },
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
  {
    page: "Brokered Ethical",
    wholesaler: Wholesalers.IMED.Name,
    pharmacy: pharmacyId,
  },
  {
    page: "Brokered OTC",
    wholesaler: Wholesalers.IMED.Name,
    pharmacy: pharmacyId,
  },
  {
    page: "Brokered Ethical",
    wholesaler: Wholesalers.LEXON.Name,
    pharmacy: pharmacyId,
  },
  {
    page: "Brokered OTC",
    wholesaler: Wholesalers.LEXON.Name,
    pharmacy: pharmacyId,
  },
  {
    page: "Brokered Ethical",
    wholesaler: Wholesalers.ONEILLS.Name,
    pharmacy: pharmacyId,
  },
  {
    page: "Brokered OTC",
    wholesaler: Wholesalers.ONEILLS.Name,
    pharmacy: pharmacyId,
  },
  {
    page: "ULM",
    wholesaler: Wholesalers.CLINIGEN.Name,
    pharmacy: pharmacyId,
  },
  {
    page: "ULM",
    wholesaler: Wholesalers.UD.Name,
    pharmacy: pharmacyId,
  },
  {
    page: "ULM",
    wholesaler: Wholesalers.ONEILLS.Name,
    pharmacy: pharmacyId,
  }
  // -------- At the top is ready cases-----------------
  // fridgecase
  // {
  //   page: "ULM",
  //   wholesaler: Wholesalers.ONEILLS.Name,
  //   pharmacy: pharmacyId,
  // },
  
  
];

describe("Manual Orders: United Drug", () => {
  before(() => {
    sql.cleanUpShoppingCart(pharmacyId);
  });

  beforeEach(() => {
    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });
    
    cy.intercept(APIRequests.request._getShoppingCart + "*").as("shopingCart");
    cy.intercept(APIRequests.request._addItemShoppingCart).as("itemAdded");
    cy.intercept(APIRequests.request._sendOrder).as("sendorder");
    cy.intercept(APIRequests.request._getDataOrderHistoryPage).as("orderHistory");
    
    cy.fixture("main").then((data) => {
      
      cy.signInCreateSession(data.pharmacyUserEmail, data.pharmacyUserPassword);
    });
  });


  for (const { page, wholesaler, pharmacy } of testCase) {
    it("Manual Order", () => {
      
      getItemForTestBetter(pharmacyId, wholesaler, page);
      
      cy.get("@item").then((item: any) => {
        sql.addItemToShoppingCart(
          item.ipuCode,
          pharmacy,
          item.id,
          currentDateTime
        );
      });

      cy.visitPage(page);
      ShoppingCart.openCart();
      placeOrder(wholesaler, page);
      toCheckOrderDetails(pharmacy);
      cy.visitPage("Order History");
      toCheckOrderHistory(wholesaler);
    });
  }
});
