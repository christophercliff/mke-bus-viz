var lib = require('../')

var TIMEOUT = 5e3

describe('lib', function(){

    this.timeout(TIMEOUT)

    it('getPatternPolyline()', function(done){
        lib.getPatternPolyline()
            .then(function(polyline){
                polyline.should.equal('gu|eGdrkwO}DC_PQU??uM@sM?c@lNNfIHX@?dO?rL?d@tPN|JDdJF~HFvKFzFApF?jFBnFFR@vFxFxHfHjPzObIzHtFbFjE~DV`@j@ZvM|L~KjKb@h@AzEChPClN?~Gt@?pKDd@?j@?zHa@vEWbG[~Ha@hEUFhBh@|WFbEA`@Gb@QfAC`@AbCEtXCp]?tXBbFBn@Fl@Dn@A|E?xU?nK@nNAtFApK?nJA`N?zK?jPCxQClSEfV_F?eIA_I@iHA@pB?lF@zIAtJCfDGj@I`@Ob@]b@_@`@oAlA]TYDc@@oF?cG@_@?ByI{GEa@?OH}EAwICuIAwBMk@AyBlFeHdP_PBoJEiJEmJEkJCkJEoJCmKG_IGsJCiLGyMGq@TkC@_@PAzAEpQ?tSEpQGrNCxNEbMAjO?hO?~NAfR')
                return done(null)
            }, done)
    })

})
