/**
 * @fileoverview feature sliced relative path checker
 * @author timur
 */
 "use strict";

 //------------------------------------------------------------------------------
 // Requirements
 //------------------------------------------------------------------------------
 
 const rule = require("../../../lib/rules/path-checker"),
   RuleTester = require("eslint").RuleTester;
 
 
 //------------------------------------------------------------------------------
 // Tests
 //------------------------------------------------------------------------------
 
 const ruleTester = new RuleTester();
 ruleTester.run("path-checker", rule, {
   valid: [
     // give me some code that won't trigger a warning
   ],
 
   invalid: [
     {
       code: "asfsa",
       errors: [{ message: "Fill me in.", type: "Me too" }],
     },
   ],
 });
