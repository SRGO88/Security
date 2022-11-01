
if (typeof cts === 'undefined') {
    // variable is undefined
    var cts = {}
}
(function (cts) {
    var Account;
    (function (Account) {
        var OrganisationForm;
        (function (OrganisationForm) {
           
            var OnLoadConfigContext = null;
            var OnLoadConfigActions = null;
            //public methods
            //handle form load event
            function HandleFormLoadEvent(executionContext) {
                try {

                    //Initilize Context Class 'CurrentAppContext', 'CurrentUserContext', 'CurrentFormContext','CurrentJsonConfigurationContext'
                    ConfigRuleEngine.ContextInitiator.initialize(executionContext, AccountDefinitions.Context, ['CurrentAppContext', 'CurrentUserContext', 'CurrentFormContext','CurrentJsonConfigurationContext'])
                        .then(
                            function success(contextInitiator) {

                                OnLoadConfigContext = contextInitiator;

                                 //Initilize Action Class
                                ConfigRuleEngine.ActionsInitiator.initialize(executionContext, AccountDefinitions.Actions, ['FormActions'])
                                    .then(
                                        function success(actionsInitiator) {

                                            OnLoadConfigActions = actionsInitiator;

                                            if (actionsInitiator) {

                                                //Retriving all the JSON for Current Entity Record
                                                let arrStrJSON = OnLoadConfigContext.ContextCollection.CurrentJsonConfigurationContext.CurrentJsonConfigurationList;

                                                if (arrStrJSON !== null && arrStrJSON.length > 0) {

                                                    arrStrJSON.forEach(function (strJSON) {

                                                        var jsonConfigurationFor = String(strJSON["cts_jsonconfigurationfor@OData.Community.Display.V1.FormattedValue"]);

                                                        if (jsonConfigurationFor.includes("Form")) {

                                                            //Calling Execute Function for JSON Validation and Execute Specific Operation like 'FielsLock' etc
                                                            new ConfigRuleEngine.ConfigRuleProcessor(strJSON["cts_jsonconfiguration"], OnLoadConfigContext, OnLoadConfigActions).execute();

                                                        }

                                                    });

                                                }

                                            }
                                        });
                            });
                }
                catch (error) {
                    console.error(error);
                    //handle error
                }
            }
            OrganisationForm.HandleFormLoadEvent = HandleFormLoadEvent;

        })(OrganisationForm = Account.OrganisationForm || (Account.OrganisationForm = {}));
    })(Account = cts.Account || (cts.Account = {}));
})(cts || (cts = {}));