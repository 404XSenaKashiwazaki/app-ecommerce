
export const formatRp = (angka) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka);
}

export const formatDiskon = (harga, dis) => {
    const diskon = (parseInt(harga) * parseInt(dis) / 100)
    return harga - diskon
}