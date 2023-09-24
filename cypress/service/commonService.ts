export function getRandomNumber(numberOfItems: number) { 
    const randomInt = Math.floor(Math.random() * numberOfItems) + 0;
    return randomInt;
 }

export function getRandomPackType() {
    var packtypesList = ['BRAND', 'FRIDGE', 'GENERIC', 'OTC', 'ULM']; // need to move to the Enums
    var packType = packtypesList[Math.floor(Math.random() * packypesList.length)];
    return packType;
}


export function getItemForTest(pharmacyId, wholesaler, page) {
    let pageType = getProductType(page);
  
    function getProductType(page: string) {
      switch (page) {
        case "Brokered Ethical":
          return (pageType = 2);
          break;
        case "Brokered OTC":
          return (pageType = 3);
          break;
        case "Second Line":
          return (pageType = 4);
          break;
        case "ULM":
          return (pageType = 5);
          break;
        default:
          break;
      }
    }
  
    cy.sqlServer(
      `SELECT TOP(1)* from dbo.GetStockProducts('${pharmacyId}', '${pageType}') where WholesalerName = '${wholesaler}' AND InStock = '1'`
    ).then((data: any) => {
      cy.log(data);
  
      cy.wrap({
        stockproductid: data[1],
      }).as("itemStockId");
    });
  
    cy.get("@itemStockId").then((item: any) => {
      cy.sqlServer(
        `SELECT Id, IPUCode, Description, PackSize, Type, NetPrice, Discount, TradePrice from Stockproducts WHERE Id = ${item.stockproductid}`
      ).then((data: any) => {
        cy.log(data);
  
        cy.wrap({
          id: data[0],
          ipuCode: data[1],
          description: data[2],
          packSize: data[3],
          packType: data[4],
          netprice: data[5],
          discount: data[6],
          tradeprice: data[7],
        }).as("item");
      });
    });
  }

