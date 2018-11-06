// -*- coding: utf-8 -*-
//  Copyright (C) 2015 Yusuke Suzuki <utatane.tea@gmail.com>
//
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//    * Redistributions of source code must retain the above copyright
//      notice, this list of conditions and the following disclaimer.
//    * Redistributions in binary form must reproduce the above copyright
//      notice, this list of conditions and the following disclaimer in the
//      documentation and/or other materials provided with the distribution.
//
//  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
//  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
//  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
//  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
//  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
//  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
//  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
//  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
//  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
"use strict";

/* eslint-disable no-unused-expressions */

const expect = require("chai").expect;
const espree = require("./util/espree");
const analyze = require("../lib").analyze;

describe("jsx support", () => {
    it("support jsx syntax in scope analysis", () => {
        const ast = espree(
            "import ActionArea from './index'; const n=1; <ActionArea></ActionArea>", "module", {
                jsx: true,
                globalReturn: true,
                impliedStrict: true
            }
        );

        const scopeManager = analyze(ast, {
            ecmaVersion: 2018,
            ecmaFeatures: { jsx: true },
            sourceType: "module"
        });

        expect(scopeManager.scopes).to.have.length(2);
        const globalScope = scopeManager.scopes[0];

        expect(globalScope.type).to.be.equal("global");
        expect(globalScope.variables).to.have.length(0);
        expect(globalScope.references).to.have.length(0);

        const scope = scopeManager.scopes[1];

        expect(scope.type).to.be.equal("module");
        expect(scope.variables).to.have.length(2);
        expect(scope.variables[0].name).to.be.equal("ActionArea");
        expect(scope.variables[1].name).to.be.equal("n");
        expect(scope.references).to.have.length(2);
    });
    it("support jsx syntax in scope analysis", () => {
        const ast = espree(
            "import { ActionArea, Button } from './index'; const n=1; <ActionArea><Button></Button></ActionArea>", "module", {
                jsx: true,
                globalReturn: true,
                impliedStrict: true
            }
        );

        const scopeManager = analyze(ast, {
            ecmaVersion: 2018,
            ecmaFeatures: { jsx: true },
            sourceType: "module"
        });

        expect(scopeManager.scopes).to.have.length(2);
        const globalScope = scopeManager.scopes[0];

        expect(globalScope.type).to.be.equal("global");
        expect(globalScope.variables).to.have.length(0);
        expect(globalScope.references).to.have.length(0);

        const scope = scopeManager.scopes[1];

        expect(scope.type).to.be.equal("module");
        expect(scope.variables).to.have.length(3);
        expect(scope.variables[0].name).to.be.equal("ActionArea");
        expect(scope.variables[1].name).to.be.equal("Button");
        expect(scope.variables[2].name).to.be.equal("n");
        expect(scope.references).to.have.length(3);
    });
});

// vim: set sw=4 ts=4 et tw=80 :
