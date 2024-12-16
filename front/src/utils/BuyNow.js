
export const handleBuyNow =  async ({ShopId, id, harga_produk},quantity, UserId, username) => {

    const orders = [{
        orders_item: [{
            ShopId: ShopId,
            ProductId: id,
            price: harga_produk,
            quantity: quantity,
            UserId: UserId
        }]
    }]

}