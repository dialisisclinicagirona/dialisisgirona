//Fitxer utils per afegir funcionalitat a les componenets
export const formatNumber = (num: number) => num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

//format de data
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
}
