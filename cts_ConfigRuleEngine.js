var ConfigRuleEngine = ConfigRuleEngine || {}
//For manage the JSON, Like Check condition, Execute the Action etc
ConfigRuleEngine.ConfigRuleProcessor = class ConfigRuleProcessor {
    constructor(strJSONRules, objContextInitiator, objActionsInitiator) {

        if (strJSONRules && objContextInitiator) {
            this.ContextInitiator = objContextInitiator;
            this.ActionsInitiator = objActionsInitiator;
            this.RuleSettings = JSON.parse(strJSONRules);
        }
    }

    executeCommand(command, args) {
        if (command) {
            if (typeof (command) === "string") {
                if (command.startsWith("@")) {
                    let acCommand = command.replace('@', '')
                    let cmdArray = acCommand.split('.');
                    if (cmdArray && cmdArray.length === 2) {
                        if (this.ActionsInitiator.ActionCollection[cmdArray[0]][cmdArray[1]]) {
                            return this.ActionsInitiator.ActionCollection[cmdArray[0]][cmdArray[1]].apply(this.ActionsInitiator.ActionCollection[cmdArray[0]], args);
                        }
                        else
                            throw 'Invalid command ' + command + ' configuration';

                    } else {
                        throw "Invalid context based property" + acProperty;
                    }
                }

                else throw 'Invalid command type';
            }
            else
                throw 'Can not have empty command name';
        }
    }

    executeActions(actions) {
        if (actions && actions.length > 0) {
            actions.forEach(action => {
                if (action.ActionType === "Command")

                    this.executeCommand(action.ActionName, action.Parameters)
            })
        }
        else {
            throw "Invalid executeActions parameters";
        }
    }

    evaluateExpression(expression) {
        try {
            if (expression.And) {
                const andExpressions = [];
                expression.And.forEach(exp => {
                    andExpressions.push(this.evaluateExpression(exp));
                })

                return this.getAND(andExpressions)
            }
            else if (expression.Or) {
                const orExpressions = [];
                expression.Or.forEach(exp => {
                    orExpressions.push(this.evaluateExpression(exp));
                })

                return this.getOR(orExpressions)
            }
            else if (expression.Not) {

                return this.getNOT(this.evaluateExpression(expression.Not));
            }
            else if (expression.Contains) {

                //Evaluate the values of Contains parameters
                if (expression.Contains[0] && expression.Contains[1]) {
                    const eqArr = [this.getContextPropertyValue(expression.Contains[0]), this.getContextPropertyValue(expression.Contains[1])];
                    return this.getContains(eqArr);
                }
                else {
                    throw "Invalid parameters for Contains Operator";
                }

            }
            else if (expression.Equals) {

                //Evaluate the values of Equal parameters
                if (expression.Equals[0] && expression.Equals[1]) {
                    const eqArr = [this.getContextPropertyValue(expression.Equals[0]), this.getContextPropertyValue(expression.Equals[1])];
                    return this.getEqual(eqArr);
                }
                else {
                    throw "Invalid parameters for Equal Operator";
                }
            }
            return false;
        }
        catch (err) {



            if (typeof err === 'object' && err !== null && 'message' in err) {
                let message = err.message;
                if (message && message.includes && !message.includes('Error Evaluating Expression: '))
                    throw "Error Evaluating Expression: " + message
                else
                    throw err;
            }
            else
                throw err;

        }
    }

    executeRule(rule) {
        if (rule) {
            if (rule.Condition && rule.Condition.Expression && rule.Condition.Steps && rule.Condition.Steps.length > 0) {
                let expression = rule.Condition.Expression;

                if (this.evaluateExpression(expression)) {

                    rule.Condition.Steps.forEach(step => {
                        if (step.Rules) {

                            this.executeChildRules(step)
                        }
                        if (step.Actions) {

                            this.executeActions(step.Actions)
                        }
                    });
                }
            }
            //If steps are without any conditions
            else if (rule.Steps && rule.Steps.length > 0) {
                rule.Steps.forEach(step => {
                    if (step.Rules) {

                        this.executeChildRules(step)
                    }
                    if (step.Actions) {

                        this.executeActions(step.Actions)
                    }
                });
            } else
                throw "Invalid rule configuration of type: " + ruleType;
        }
        else
            throw "Can not have empty rule type";
    }

    executeChildRules(ruleSettings) {
        let arrRules = ruleSettings.Rules;
        arrRules.forEach(rule => {
            this.executeRule(rule);
        });
    }

    execute() {

        try { this.executeChildRules(this.RuleSettings) }
        catch (e) { alert(e); }
    }

    getContextPropertyValue(property) {

                if (typeof (property) === "string") {
                    if (property.startsWith("@")) {
                        let acProperty = property.replace('@', '')
                        let propArray = acProperty.split('.');
                        if (propArray && propArray.length > 1) {
                            let prop = this.ContextInitiator.ContextCollection;
                            for (let i = 0; i < propArray.length; i++) {
                                if (prop && propArray[i]) {
                                    prop = prop[propArray[i]];
                                }
                            }
                            return prop;
                        } else {
                            throw "Invalid context based property" + acProperty;
                        }
                    }
                    else return property;
                }
                else return property;

    }

    getRuleObject(ruleType) {
        if (ruleType && this.ContextInitiator.ContextCollection && this.ContextInitiator.ContextCollection[ruleType]) {
            return this.ContextInitiator.ContextCollection[ruleType];
        }
        return null;
    }

    getAND(expressions) {
        if (expressions && expressions.length > 0) {
            for (let i = 0; i < expressions.length; i++) {
                if (!expressions[i]) {
                    return false;
                }
            }
            return true;
        }
        else {
            throw "Invalid getAND parameters";
        }
    }

    getOR(expressions) {
        if (expressions && expressions.length > 0) {
            for (let i = 0; i < expressions.length; i++) {
                if (expressions[i]) {
                    return true;
                }
            }
            return false;
        }
        else {
            throw "Invalid getOR parameters";
        }
    }
    //Only Two expressions at a time
    getEqual(expressions) {


        if (expressions && expressions.length === 2) {

            if (expressions[0] !== expressions[1]) {
                return false;
            }
            return true;
        }
        else
            throw "Invalid getEqual parameters";
    }
    //Only Two expressions at a time
    getContains(expressions) {
            if (expressions && expressions.length === 2) {

                return expressions[0].includes(expressions[1]);

            }
            else
                throw "Invalid getContains parameters";
    }

    getLessThan(expressions) {


        if (expressions && expressions.length === 2) {

            if (expressions[0] < expressions[1]) {
                return true;
            }
            return false;
        }
        throw "Invalid getLessThan parameters";
    }

    getGreaterThan(expressions) {

        if (expressions && expressions.length === 2) {

            if (expressions[0] > expressions[1]) {
                return true;
            }
            return false;
        }
        throw "Invalid getGreaterThan parameters";
    }

    getNOT(expression) {
        return (!expression)
    }
}

//For Context initialize
ConfigRuleEngine.ContextInitiator = class ContextInitiator {

    constructor(executionContext, ContextCollection) {
        this.executionContext = executionContext;
        this.ContextCollection = ContextCollection;
    }
    //Call this function to get an object instead of the constructer.
    static async initialize(executionContext, contextDefinitions, contextNames = []) {
        if (!contextNames || contextNames.length <= 0) {
            contextNames = Object.getOwnPropertyNames(contextDefinitions);
        }
        if (!contextDefinitions)
            throw 'No Context definitions found.';
        let ContextCollection = await ConfigRuleEngine.ContextInitiator.getContext(executionContext, contextDefinitions, contextNames);
        let objContextInitiator = new ConfigRuleEngine.ContextInitiator(executionContext, ContextCollection);
        return objContextInitiator;
    }
    static async getContext(executionContext, contextDefinitions, contextNames) {
        let ContextCollection = {};
        if (!contextNames || contextNames.length < 0) {
            throw "contextNames is required parameter";
        }
        if (!contextDefinitions)
            throw 'No Context definitions found.';
        if (contextNames && contextNames.length > 0) {
            for (let index = 0; index < contextNames.length; index++) {
                let context = contextNames[index];
                switch (context) {
                    case "ContextName":
                        //Create special case for each Rule requiring special parameters
                        if (contextDefinitions[context]) {
                            ContextCollection[context] = new contextDefinitions[context](executionContext);
                        } else {
                            throw "No common context of type: " + context + " found";
                        }
                        break;
                    default:
                        //All other contextNames needing only executionContext and globalContext as parameters
                        if (contextDefinitions[context]) {
                            //check if initialize function exists, this function can be used to initialize class properties which are dependent on async calls, as in constructers async calls can't be made
                            //If initialize function exists, cinstructor is used inderectly to create an object of the class

                            if (contextDefinitions[context]["initialize"])
                                ContextCollection[context] = await contextDefinitions[context]["initialize"](executionContext);
                            else
                                ContextCollection[context] = new contextDefinitions[context](executionContext);
                        } else {
                            throw "No common context of type: " + context + " found";
                        }
                        break;
                }
            }
        }

        return ContextCollection;
    }
    refreshContext(executionContext, contextDefinitions, contextNames = []) {

        if (!contextNames || contextNames.length < 0) {
            throw "contextNames is required parameter";
        }
        if (!contextDefinitions)
            throw 'No Context definitions found.';
        if (contextNames && contextNames.length > 0) {
            for (let index = 0; index < contextNames.length; index++) {
                let context = contextNames[index];
                switch (context) {
                    case "ContextName":
                        //Create special case for each Rule requiring special parameters
                        if (contextDefinitions[context]) {
                            this.ContextCollection[context] = new contextDefinitions[context](executionContext);
                        } else {
                            throw "No common context of type: " + context + " found";
                        }
                        break;
                    default:
                        //All other contextNames needing only executionContext and globalContext as parameters
                        if (contextDefinitions[context]) {
                            //check if initialize function exists, this function can be used to initialize class properties which are dependent on async calls, as in constructers async calls can't be made
                            //If initialize function exists, cinstructor is used inderectly to create an object of the class

                            if (contextDefinitions[context]["initialize"])
                                this.ContextCollection[context] = contextDefinitions[context]["initialize"](executionContext);
                            else
                                this.ContextCollection[context] = new contextDefinitions[context](executionContext);
                        } else {
                            throw "No common context of type: " + context + " found";
                        }
                        break;
                }
            }
        }
    }

}

//For Action initialize
ConfigRuleEngine.ActionsInitiator = class ActionsInitiator {

    constructor(executionContext, ActionCollection) {
        this.executionContext = executionContext;
        this.ActionCollection = ActionCollection;
    }
    //Call this function to get an object instead of the constructer.
    static async initialize(executionContext, actionDefinitions, actionNames = []) {
        if (!actionNames || actionNames.length <= 0) {
            actionNames = Object.getOwnPropertyNames(actionDefinitions);
        }
        if (!actionDefinitions)
            throw 'No Action definitions found.';
        let ActionCollection = await ConfigRuleEngine.ActionsInitiator.getActions(executionContext, actionDefinitions, actionNames);
        let objActionsInitiator = new ConfigRuleEngine.ActionsInitiator(executionContext, ActionCollection);
        return objActionsInitiator;
    }
    static async getActions(executionContext, actionDefinitions, actionNames) {
        let ActionCollection = {};
        if (!actionNames || actionNames.length <= 0) {
            throw "actionNames is required parameter";
        }
        if (!actionDefinitions)
            throw 'No Action definitions found.';

        for (let index = 0; index < actionNames.length; index++) {
            let action = actionNames[index];
            switch (action) {
                case "ActionName":
                    //Create special case for each Rule requiring special parameters
                    if (actionDefinitions[action]) {
                        ActionCollection[action] = new actionDefinitions[action](executionContext);
                    } else {
                        throw "No common action of type: " + action + " found";
                    }
                    break;
                default:
                    //All other contextNames needing only executionContext and globalContext as parameters
                    if (actionDefinitions[action]) {
                        //check if initialize function exists, this function can be used to initialize class properties which are dependent on async calls, as in constructers async calls can't be made
                        //If initialize function exists, cinstructor is used inderectly to create an object of the class

                        if (actionDefinitions[action]["initialize"])
                            ActionCollection[action] = await actionDefinitions[action]["initialize"](executionContext);
                        else
                            ActionCollection[action] = new actionDefinitions[action](executionContext);
                    } else {
                        throw "No common action of type: " + action + " found";
                    }
                    break;
            }
        }
        return ActionCollection;
    }
    refreshActions(executionContext, actionDefinitions, actionNames) {

        if (!actionNames || actionNames.length <= 0) {
            throw "actionNames is required parameter";
        }
        if (!actionDefinitions)
            throw 'No Action definitions found.';

        for (let index = 0; index < actionNames.length; index++) {
            let action = actionNames[index];
            switch (action) {
                case "ActionName":
                    //Create special case for each Rule requiring special parameters
                    if (actionDefinitions[action]) {
                        this.ActionCollection[action] = new actionDefinitions[action](executionContext);
                    } else {
                        throw "No common action of type: " + action + " found";
                    }
                    break;
                default:
                    //All other contextNames needing only executionContext and globalContext as parameters
                    if (actionDefinitions[action]) {
                        //check if initialize function exists, this function can be used to initialize class properties which are dependent on async calls, as in constructers async calls can't be made
                        //If initialize function exists, cinstructor is used inderectly to create an object of the class

                        if (actionDefinitions[action]["initialize"])
                            this.ActionCollection[action] = actionDefinitions[action]["initialize"](executionContext);
                        else
                            this.ActionCollection[action] = new actionDefinitions[action](executionContext);
                    } else {
                        throw "No common action of type: " + action + " found";
                    }
                    break;
            }
        }
    }
}

