import { LightningElement,wire,track,api } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import RATING_FIELD from '@salesforce/schema/Account.Rating';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
import getAccounts from '@salesforce/apex/FilteredAccountController.getAccounts';

const columns=[
    {label:'Account Id',fieldName:'Id'},
    {label:'Account Name',fieldName:'Name',type:'text'},
    {label:'Phone',fieldName:'Phone',type:'phone'},
    {label:'Billing State',fieldName:'BillingState',type:'text'},
    {label:'Billing City',fieldName:'BillingCity',type:'text'},
    {label:'Rating',fieldName:'Rating',type:'text'},
    {label:'Industry',fieldName:'Industry',type:'text'},
    {label:'Annual Revenue',fieldName:'AnnualRevenue',type:'currency'},
    {label:'No. of Employees',fieldName:'NumberOfEmployees',type:'number'},

];

export default class SearchCriteria extends LightningElement {

    ratingPicklistValues;
    industryPicklistValues;
    @track nameval="";
    @track phoneval="";
    @track stateval=null;
    @track cityval=null;
    @track ratingval=null;
    @track industryval=null;
    @track searchable=[];
    @track showAccounts=false;
    @track columns=columns;
    @track norecord=false;

    @track items=[];
    @track page = 1; 
    @track startingRecord = 1;
    @track endingRecord = 0; 
    @track pageSize = 10; 
    @track totalRecountCount = 0;
    @track totalPage = 0;
    isPageChanged = false;
   
    @wire(getPicklistValues,{
        recordTypeId: "012000000000000AAA",
        fieldApiName: RATING_FIELD
    })
    ratingPicklists({error,data}){
        if(error){
            console.error("error",error);
        } else if(data){
            this.ratingPicklistValues=[
                ...data.values
            ];
        }
    }

    @wire(getPicklistValues,{
        recordTypeId: "012000000000000AAA",
        fieldApiName: INDUSTRY_FIELD
    })
    industryPicklists({error,data}){
        if(error){
            console.error("error",error);
        } else if(data){
            this.industryPicklistValues=[
                ...data.values
            ];
        }
    }

    get billingStateValues(){
        return [
            { label: 'MH', value: 'mh' },
            { label: 'DL', value: 'dl' },
            { label: 'RJ', value: 'rj' },
            { label: 'MP', value: 'mp' },
            { label: 'GJ', value: 'gj' },
            { label: 'KA', value: 'ka' },
            { label: 'TN', value: 'tn' },
        ];
    }

    get billingCityValues(){
        return [
            { label: 'Mumbai', value: 'mumbai' },
            { label: 'Pune', value: 'pune' },
            { label: 'New Delhi', value: 'new delhi' },
            { label: 'Jaipur', value: 'jaipur' },
            { label: 'Indore', value: 'indore' },
            { label: 'Surat', value: 'surat' },
            { label: 'Bangalore', value: 'bangalore' },
            { label: 'Chennai', value: 'chennai' },
        ];
    }

    handleChange(event){
        this[event.target.name] = event.target.value;
    }
    
    handleKeyup(event){
        this[event.target.name] = event.target.value;
    }

    handleReset(){
        
        const inputFields=this.template.querySelectorAll('lightning-input');
        if(inputFields){
            inputFields.forEach(field=>{
                field.value="";
            })
        }

        const comboFields=this.template.querySelectorAll('lightning-combobox');
        if(comboFields){
            comboFields.forEach(field=>{
                field.value="";
            })
        }
        this.nameval="";
        this.phoneval="";
        this.stateval=null;
        this.cityval=null;
        this.ratingval=null;
        this.industryval=null;
        this.showAccounts=false;
        this.norecord=false;
    }

    handleSearch(){
        getAccounts({nameval:this.nameval,phoneval:this.phoneval,stateval:this.stateval,cityval:this.cityval,ratingval:this.ratingval,industryval:this.industryval})
        .then((result) => {
            if(result.length==0){
                this.norecord=true;
            }else this.norecord=false;
            
            this.searchable=result;
            this.totalRecountCount = result.length; 
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); 
            this.items = this.searchable.slice(0,this.pageSize);
            this.endingRecord = this.pageSize;

            this.error=undefined;
            this.showAccounts=true;
        })
        .catch((error) =>{
            this.searchable=undefined;
            console.log("Error occured: "+error.body.message);
        })
    }

    previousHandler() {
        this.isPageChanged = true;
        if (this.page > 1) {
            this.page = this.page - 1;
            this.displayRecordPerPage(this.page);
        }
    }

    nextHandler() {
        this.isPageChanged = true;
        if((this.page<this.totalPage) && this.page !== this.totalPage){
            this.page = this.page + 1;
            this.displayRecordPerPage(this.page);            
        }
    }

    displayRecordPerPage(page){

        this.startingRecord = ((page -1) * this.pageSize) ;
        this.endingRecord = (this.pageSize * page);

        this.endingRecord = (this.endingRecord > this.totalRecountCount) 
                            ? this.totalRecountCount : this.endingRecord; 

        this.items = this.searchable.slice(this.startingRecord, this.endingRecord);
        this.startingRecord = this.startingRecord + 1;
    }    
}