export function currentFormatter(valor,moneda,localidad){
    return new Intl.NumberFormat(localidad,{
        style: 'currency',
        currency: moneda,
        minimumFractionDigits:0
    }).format(valor);
}