export const  convertToAbbreviated= (value ,_toFixed=2) => {
    // Attempt to convert the value to a number
    const numericValue = Number(value);
  
    // Check if the conversion was successful
  
    if (numericValue >= 1_000_000_000) {
        return (numericValue / 1_000_000_000).toFixed(_toFixed).replace(/\.0$/, '') + 'B';
    } else if (numericValue >= 1_000_000) {
        return (numericValue / 1_000_000).toFixed(_toFixed).replace(/\.0$/, '') + 'M';
    } else if (numericValue >= 1_000) {
        return (numericValue / 1_000).toFixed(_toFixed).replace(/\.0$/, '') + 'K';
    } else {
        return numericValue.toFixed(_toFixed);
    }
  }


  export function sortAddress(add) {
    const sortAdd = `${add?.slice(0, 6)}...${add?.slice(add.length - 4)}`;
    return sortAdd;
  }
  export function sortAddressDoc(add) {
    const sortAdd = `${add?.slice(0, 3)}****${add?.slice(add.length - 3)}`;
    return sortAdd.toUpperCase();
  }