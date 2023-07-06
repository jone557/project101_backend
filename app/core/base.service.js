/**
 * get skip value for pagination
 * @param limit
 * @param page
 */
function getSkipValue(limit, page) {
    return (page - 1) * limit;
}


var emailRegrex = /^[a-zA-Z0-9._+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})$/

function validateEmail(email) {
    var requestedEmail = emailRegrex.exec(email)
    let validorNot;
    if (!requestedEmail) return validorNot= false;
    else return validorNot = true
}
const BaseService = {
    getSkipValue,
    validateEmail
};
module.exports = BaseService;