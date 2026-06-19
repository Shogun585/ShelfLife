const determineStatus = (expiryDate) => {
    const expiry = new Date(expiryDate).getDate();
    const today = new Date().getDate();

    const diff = expiry - today;

    if(diff < 0){
        return 'expired';
    }else if(diff <= 3){
        return 'expiring-soon';
    }else if(diff > 3){
        return 'fresh';
    }
}

module.exports = {
    determineStatus
}