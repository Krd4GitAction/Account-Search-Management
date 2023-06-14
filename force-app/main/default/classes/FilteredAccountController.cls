public with sharing class FilteredAccountController {
    
    @AuraEnabled
    public static List<Account> getAccounts(String nameval, String phoneval, String stateval, String cityval, String ratingval, String industryval) {
        
        String query;
        String condition = (String.isNotBlank(nameval) ? 'Name LIKE \'' + '%' + nameval + '%\'' : '');
        condition+= (String.isNotBlank(phoneval) ? (String.isNotBlank(condition) ? ' AND ':'')+ 'Phone LIKE \'' + '%' + phoneval + '%\'' : '');
        condition+= (String.isNotBlank(stateval) ? (String.isNotBlank(condition) ? ' AND ':'')+ 'BillingState LIKE \'' + '%' + stateval + '%\'' : '');
        condition+= (String.isNotBlank(cityval) ? (String.isNotBlank(condition) ? ' AND ':'')+ 'BillingCity LIKE \'' + '%' + cityval + '%\'' : '');
        condition+= (String.isNotBlank(ratingval) ? (String.isNotBlank(condition) ? ' AND ':'')+ 'Rating LIKE \'' + '%' + ratingval + '%\'' : '');
        condition+= (String.isNotBlank(industryval) ? (String.isNotBlank(condition) ? ' AND ':'')+ 'Industry LIKE \'' + '%' + industryval + '%\'' : '');

        if(String.isNotBlank(condition)){
            query= 'SELECT Id,Name,Phone,BillingState,BillingCity,Rating,Industry,AnnualRevenue,NumberOfEmployees FROM Account WHERE '+condition+' ORDER BY Name';
        } else{
            query= 'SELECT Id,Name,Phone,BillingState,BillingCity,Rating,Industry,AnnualRevenue,NumberOfEmployees FROM Account ORDER BY Name LIMIT 200';
        }

        List<Account> records= Database.query(query);
        return records;
    }
}