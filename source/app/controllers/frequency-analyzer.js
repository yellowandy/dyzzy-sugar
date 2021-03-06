'use strict';

var fs = require('fs');
var _ = require('underscore');
var graphNode = require('../models/graph-node');
var async = require('async');

exports.start = function(callback) {
    console.log('frequency analyzer started');
    var data = fs.readFileSync(__dirname + '/frequency-counter.txt');
    if (data) {
        data = JSON.parse(data);

        async.eachSeries(data, function(emailData, singleCallback) {
            // Add node for email if necessary.
            graphNode.storeNode(emailData.sourceEmail, function() {
                var frequencyScore = 1.0;

                graphNode.storeNode(emailData.relatedEmail, function() {
                    graphNode.addRelationship(
                        emailData.sourceEmail,
                        emailData.relatedEmail,
                        'frequencyScore',
                        frequencyScore,
                        function() {
                            singleCallback();
                        });
                });
            });
        }, function() {
            console.log('DONE ANALYZING');
            callback();
        });
    }
};