var CommonContext = CommonContext || {}

// Get and initialize Current App Details
CommonContext.CurrentAppContext = class CurrentAppContext {
    constructor(executionContext, appName) {
        this.executionContext = executionContext;
        this.formContext = executionContext.getFormContext();
        this.appName = appName;
        console.log("class CurrentAppContext constructed");
    }
    static async initialize(executionContext) {
        if (executionContext) {
            let globalContext = Xrm.Utility.getGlobalContext();
            let appName = await CommonContext.CurrentAppContext.getAppName(globalContext);
            let objCurrentAppContext = new CommonContext.CurrentAppContext(executionContext,appName);
            return objCurrentAppContext;
        }
        else
            throw "Could not initiate CurrentAppContext class.";
    }
    static async getAppName(globalContext) {
        if (globalContext) {
            let appName = await globalContext.getCurrentAppName().then(
                function successCallback(appName) {

                    return appName;

                }, function errorCallback() {

                    throw "Could not retrieve App details."

                });

            return appName;
        }
    }

}

// Get and initialize Current Users and Team Details
CommonContext.CurrentUserContext = class CurrentUserContext {
    constructor(executionContext, teamsDetails, teamNames) {
        if (executionContext && teamsDetails && teamNames) {
            this.executionContext = executionContext
            this.formContext = executionContext.getFormContext();
            this.globalContext = Xrm.Utility.getGlobalContext();
            this.teamsDetails = teamsDetails;
            this.teamNames = teamNames;
            console.log("class CurrentUserContext constructed");
        } else
            throw "Could not initiate CurrentUserContext class.";
    }
    static async initialize(executionContext) {
        if (executionContext) {
            let teamsForCurrentUser = await CommonContext.CurrentUserContext.getTeamDetailsForCurrentUser();
            const arrTeamNamesForCurrentUser = [];
            if (teamsForCurrentUser && teamsForCurrentUser.length > 0) {

                teamsForCurrentUser.forEach(team => {
                    arrTeamNamesForCurrentUser.push(team["name"]);
                });
            }

            let objCurrentUserContext = new CommonContext.CurrentUserContext(executionContext, teamsForCurrentUser, arrTeamNamesForCurrentUser);
            return objCurrentUserContext;
        }
        else
            throw "Could not initiate CurrentAppContext class.";
    }
    static async getTeamDetailsForCurrentUser() {

        let teamQueryOption = "?$select=name,teamid,teamtype&$expand=teammembership_association($filter=(Microsoft.Dynamics.CRM.EqualUserId(PropertyName='systemuserid')))&$filter=(teamtype ne 1) and (teammembership_association/any(o1:(o1/Microsoft.Dynamics.CRM.EqualUserId(PropertyName='systemuserid'))))&$orderby=name asc";
        let teamsForCurrentUser = await Xrm.WebApi.retrieveMultipleRecords("team", teamQueryOption).then(
            function success(result) {
                if (result && result.entities && result.entities.length > 0) {
                    return result.entities;
                } else {
                    return null;
                }

            },
            function (error) {
                alert(error.message);
            }
        );
        return teamsForCurrentUser;
    }

}

// Get and initialize Current Record BPF Details
CommonContext.ActiveProcessContext = class ActiveProcessContext {
    constructor(executionContext) {
        if (executionContext) {
            this.executionContext = executionContext;
            this.processArgs = executionContext.getEventArgs();
            this.formContext = executionContext.getFormContext();
            this.globalContext = Xrm.Utility.getGlobalContext();
            this.activeStage = this.formContext.data.process.getActiveStage();
            this.activeStageName = this.activeStage.getName();
            console.log("class ActiveProcessContext constructed");
        } else
            throw "Could not initiate ActiveProcessContext class."
    }
}

// Get and initialize Current Record BPF Details OnChange
CommonContext.ActiveProcessContextOnChange = class ActiveProcessContextOnChange {
    constructor(executionContext) {
        if (executionContext) {
            this.executionContext = executionContext;
            this.processArgs = executionContext.getEventArgs();
            this.formContext = executionContext.getFormContext();
            this.globalContext = Xrm.Utility.getGlobalContext();
            this.bpfArgs = executionContext.getEventArgs();
            this.stageName = this.bpfArgs._stage._stageStep.description;
            this.activeStageName = this.formContext.data.process.getActiveStage().getName();
            console.log("class ActiveProcessContextOnChange constructed");
        } else
            throw "Could not initiate ActiveProcessContextOnChange class."
    }
}

// Get and initialize Current Form Details
CommonContext.CurrentFormContext = class CurrentFormContext {
    constructor(executionContext) {
        if (executionContext) {
            console.log("class CurrentFormContext constructed");
            this.executionContext = executionContext
            this.formContext = executionContext.getFormContext();
            this.globalContext = Xrm.Utility.getGlobalContext();
            this.formItem = this.formContext.ui.formSelector.getCurrentItem();
            this.formId = this.formItem.getId();
            this.formName = this.formItem.getLabel();
            this.isFormVisible = this.formItem.getVisible();
        } else
            throw "Could not initiate CurrentFormContext class."
    }

}

// Get and initialize Current Record and its related Data Details
CommonContext.DataContext = class CurrentFormContext {
    constructor(executionContext) {
        if (executionContext) {
            this.executionContext = executionContext
            this.formContext = executionContext.getFormContext();
            this.globalContext = Xrm.Utility.getGlobalContext();
            console.log("class DataContext constructed");

        } else
            throw "Could not initiate DataContext class."
    }

}

// Get and initialize Current Record Json Configuration Details for validation
CommonContext.CurrentJsonConfigurationContext = class CurrentJsonConfigurationContext {
    constructor(executionContext, CurrentJsonConfigurationList) {
        if (executionContext && CurrentJsonConfigurationList) {
            this.executionContext = executionContext
            this.CurrentJsonConfigurationList = CurrentJsonConfigurationList;
            console.log("class CurrentJsonConfigurationContext constructed");
        } else
            throw "Could not initiate CurrentJsonConfigurationContext class.";
    }
    static async initialize(executionContext) {
        if (executionContext) {
            let CurrentJsonConfigurationList = await CommonContext.CurrentJsonConfigurationContext.getCurrentJsonConfigurationList(executionContext);
            const arrCurrentJsonConfiguration = [];
            if (CurrentJsonConfigurationList && CurrentJsonConfigurationList.length > 0) {

                CurrentJsonConfigurationList.forEach(JsonConfiguration => {
                    arrCurrentJsonConfiguration.push(JsonConfiguration);
                });
            }

            let objCurrentUserContext = new CommonContext.CurrentJsonConfigurationContext(executionContext, arrCurrentJsonConfiguration);
            return objCurrentUserContext;
        }
        else
            throw "Could not initiate CurrentAppContext class.";
    }
    static async getCurrentJsonConfigurationList(executionContext) {

        let CurrentJsonConfigurationListQuery = "?$select=cts_entitylogicalname,cts_executionorder,cts_jsonconfigurationfor,cts_global,cts_jsonconfiguration,statecode,cts_teamname&$filter=((cts_entitylogicalname eq '" + executionContext.getFormContext().data.entity.getEntityName() + "' and statecode eq 0) or cts_global eq true)&$orderby=cts_jsonconfigurationfor asc,cts_executionorder asc";

        let CurrentJsonConfigurationList = await Xrm.WebApi.retrieveMultipleRecords("cts_commonjsonconfiguration", CurrentJsonConfigurationListQuery).then(
            function success(result) {
                if (result && result.entities && result.entities.length > 0) {
                    return result.entities;
                } else {
                    return null;
                }

            },
            function (error) {
                alert(error.message);
            }
        );
        return CurrentJsonConfigurationList;
    }

}