let background_n3 = `
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix dct: <http://purl.org/dc/terms/> .
@prefix owl: <http://www.w3.org/2002/07/owl#>.

# OWL
{?A owl:differentFrom ?B} => {?B owl:differentFrom ?A}.
{?X owl:sameAs ?Y} => {?Y owl:sameAs ?X}.
{?X owl:sameAs ?Y. ?Y owl:sameAs ?Z} => {?X owl:sameAs ?Z}.
{?X owl:sameAs ?Y. ?X owl:differentFrom ?Y} => false.

# RDFS
{
    ?X rdfs:domain ?Y .
}
=>
{
    {
        ?U ?X ?V .
    }
    =>
    {
        ?U rdf:type ?Y .
    } .
} .

{
    ?X rdfs:range ?Y .
}
=>
{
    {
        ?U ?X ?V .
    }
    =>
    {
        ?V rdf:type ?Y .
    } .
} .

{
    ?X rdfs:subClassOf ?Y .
}
=>
{
    {
        ?U rdf:type ?X .
    }
    =>
    {
        ?U rdf:type ?Y.
    } .
} .

{
    ?X rdfs:subPropertyOf ?Y .
}
=>
{
    {
        ?U ?X ?V .
    }
    =>
    {
        ?U ?Y ?V.
    } .
} .
`;

let deodata_n3 = `
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .
@prefix deo: <https://github.com/KNowledgeOnWebScale/n3s-policy-consistency-checker/> .
@prefix graph: <http://www.w3.org/2000/10/swap/graph#> .
@prefix list: <http://www.w3.org/2000/10/swap/list#> .
@prefix log: <http://www.w3.org/2000/10/swap/log#> .

{
    ( {?S ?P ?O} {
        ?S ?P ?O .
        ?P log:notEqualTo log:implies .
        ?P log:notEqualTo deo:contains .
    } ?L) log:collectAllIn _:x .
    ?G graph:list ?L .
}
=>
{
    deo:next_world deo:contains ?G .
} .
`;

let deo_n3 = `
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .
@prefix deo: <https://github.com/KNowledgeOnWebScale/n3s-policy-consistency-checker/> .
@prefix log: <http://www.w3.org/2000/10/swap/log#> .
@prefix graph: <http://www.w3.org/2000/10/swap/graph#> .
@prefix list: <http://www.w3.org/2000/10/swap/list#> .

odrl:Set a deo:PolicyClass .
odrl:Offer a deo:PolicyClass .
odrl:Agreement a deo:PolicyClass .

# Translating odrl:permission (without constraints)
{
    ?Policy a ?What .
    ?What a deo:PolicyClass .
    ?Policy odrl:permission ?Perm .
    ?Perm odrl:target ?Target .
    ?SCOPE log:notIncludes { ?Perm odrl:constraint ?Constraint } .
    ( ?Action { ?Perm odrl:action ?Action } ?List ) log:collectAllIn _:x .
}
=>
{
    {
        ?Perm odrl:assignee ?Assignee .
        ( ?List ?Assignee ?Target ) deo:makeActionGraph ?G .
    }
    =>
    {
        deo:compiled deo:contains {
            ?Policy deo:permission ?G .
        } .
    } .

    {
        ?Perm odrl:duty ?Duty .
        ?Duty odrl:action ?Action2 .
        ?Duty odrl:assigner ?Assigner .
        ?Duty odrl:assignee ?Assignee .
        ?Duty odrl:target ?Target2 .
        ( ?List ?Assignee ?Target ) deo:makeActionGraph ?G .
    }
    =>
    {
        deo:compiled deo:contains {
            {
                ?Policy deo:permission ?G .
            }
            =>
            {
                ?Policy deo:obligation {
                    ?Assignee ?Action2 ?Target2 .
                } .
            } .
        } .
    } .
} .

# Translating odrl:prohibition (without constraints)
{
    ?Policy a ?What .
    ?What a deo:PolicyClass .
    ?Policy odrl:prohibition ?Perm .
    ?Perm odrl:target ?Target .
    ?SCOPE log:notIncludes { ?Perm odrl:constraint ?Constraint } .
    ( ?Action { ?Perm odrl:action ?Action } ?List ) log:collectAllIn _:x .
}
=>
{
    {
        ?Perm odrl:assignee ?Assignee .
        ( ?List ?Assignee ?Target ) deo:makeActionGraph ?G .
    }
    =>
    {
        deo:compiled deo:contains {
            ?Policy deo:prohibition ?G .
        } .
    } .

    {
        ?SCOPE log:notIncludes { ?Perm odrl:assignee ?Assignee } .
        ( ?List deo:SomeAssignee ?Target ) deo:makeActionGraph ?G .
    }
    =>
    {
        deo:compiled deo:contains {
            ?Policy deo:prohibition ?G .
        } .
    } .
} .

# Translating odrl:obligation (without constraints)
{
    ?Policy a ?What .
    ?What a deo:PolicyClass .
    ?Policy odrl:obligation ?Perm .
    ?Perm odrl:target ?Target .
    ?SCOPE log:notIncludes { ?Perm odrl:constraint ?Constraint } .
    ( ?Action { ?Perm odrl:action ?Action } ?List ) log:collectAllIn _:x .
}
=>
{
    {
        ?Perm odrl:assignee ?Assignee .
        ( ?List ?Assignee ?Target ) deo:makeActionGraph ?G .
    }
    =>
    {
        deo:compiled deo:contains {
            ?Policy deo:obligation ?G .
        } .
    } .

    {
        ?SCOPE log:notIncludes { ?Perm odrl:assignee ?Assignee } .
        ( ?List deo:SomeAssignee ?Target ) deo:makeActionGraph ?G .
    }
    =>
    {
        deo:compiled deo:contains {
            ?Policy deo:obligation ?G .
        } .
    } .
} .

# Helper functions

# Create an Graph G from an Action list
{
    ( ?List ?Assignee ?Target ) deo:makeActionGraph ?G .
}
<=
{
    ( ?List ?Assignee ?Target () ) deo:_makeActionGraph ?GL .
    ?G graph:list ?GL .
} .

{
    ( () ?Assignee ?Target ?Acc ) deo:_makeActionGraph ?Acc .
}
<= true .

{
    ( ?List ?Assignee ?Target ?Acc ) deo:_makeActionGraph ?G .
}
<=
{
    ?List list:length ?N .
    ?N log:notEqualTo 0 .
    ?List list:firstRest (?H ?T) .
    ( ?Acc ( { ?Assignee ?H ?Target } ) ) list:append ?Acc2 .
    ( ?T ?Assignee ?Target ?Acc2 ) deo:_makeActionGraph ?G .
} .
`;

let deo_query = `
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .
@prefix deo: <https://github.com/KNowledgeOnWebScale/n3s-policy-consistency-checker/> .
@prefix log: <http://www.w3.org/2000/10/swap/log#> .

{
    deo:compiled deo:contains ?G .
} => ?G .

{
    deo:next_world deo:contains ?G .
} => {
    deo:next_world deo:contains ?G .
} .
`;

let modal_n3 = `
@prefix : <https://github.com/KNowledgeOnWebScale/n3s-policy-consistency-checker/> .
@prefix log: <http://www.w3.org/2000/10/swap/log#> .
@prefix graph: <http://www.w3.org/2000/10/swap/graph#> .
@prefix list: <http://www.w3.org/2000/10/swap/list#> .
@prefix math: <http://www.w3.org/2000/10/swap/math#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

# Introduce the modal operator []
:box a log:ModalOperator ;
    :defines :obligation , :permission , :prohibition .

# Define deontic operators
:obligation a log:Obligation .
:permission a log:Permission .
:prohibition a log:Prohibition .

# Define deontic operators in terms of the modal operator []
{
    ?Deo a log:Obligation .
    ?Box a log:ModalOperator .
    ?Box :defines ?Deo .

    ?Policy ?Deo ?What .
}
=>
{
    :world :contains {
        ?Policy ?Box ?What .
    } .
} .

{
    ?Deo a log:Permission .
    ?Box a log:ModalOperator .
    ?Box :defines ?Deo .

    ?Policy ?Deo ?What .
}
=>
{
    :world :contains {
        () log:onNegativeSurface {
            ?Policy ?Box {
                () log:onNegativeSurface ?What .
            } .
        } .
    } .
} .

{
    ?Deo a log:Prohibition .
    ?Box a log:ModalOperator .
    ?Box :defines ?Deo .

    ?Policy ?Deo ?What .
}
=>
{
    :world :contains {
        ?Policy ?Box {
            () log:onNegativeSurface ?What .
        } .
    } .
} .
`;

let modal_query = `
@prefix : <https://github.com/KNowledgeOnWebScale/n3s-policy-consistency-checker/> .
@prefix log: <http://www.w3.org/2000/10/swap/log#> .
@prefix graph: <http://www.w3.org/2000/10/swap/graph#> .
@prefix list: <http://www.w3.org/2000/10/swap/list#> .

{
    ( ?What { :world :contains ?What . } ?L ) log:collectAllIn ?Sc .
    ( { :next_world :contains ?What2 } { :next_world :contains ?What2 } ?M ) log:collectAllIn ?Sc2 .
    ( ?L ?M ) list:append ?N .
    ?N list:length ?Len .
    ?Len log:notEqualTo 0.
    ?G graph:list ?N .
}
=> ?G .

{
    ?Box a log:ModalOperator .
}
=>
{
    ?Box a log:ModalOperator .
} .
`;

let deontic_compile = `
@prefix : <https://github.com/KNowledgeOnWebScale/n3s-policy-consistency-checker/> .
@prefix log: <http://www.w3.org/2000/10/swap/log#> .
@prefix graph: <http://www.w3.org/2000/10/swap/graph#> .

# deontic makes every [] a reality in the next world (there is just one serial next world)
(_:What _:Box _:Policy) log:onNegativeSurface {
    _:Box a log:ModalOperator .
    _:Policy _:Box _:What .
    () log:onNegativeSurface {
        :next_world :contains _:What .
    } .
} .

# deontic makes every <> = ~[]~ a reality in the next world
(_:What _:Box _:Policy) log:onNegativeSurface {
    _:Box a log:ModalOperator .
    () log:onNegativeSurface {
        _:Policy _:Box {
            () log:onNegativeSurface _:What .
        } .
    } .
    () log:onNegativeSurface {
        :next_world :contains _:What .
    } .
} .

(_:What) log:onNegativeSurface {
    :next_world :contains _:What .
    () log:onNegativeAnswerSurface _:What .
} .
`;

$( document ).ready(function() {
    console.log( "document loaded" );

    $('#execute').on("click", async () => {
        const IS_OK = '&#x1F60C;';
        const IS_ERROR = '&#x1F631;';
        const policy = $("#policy").val();
        const data = $("#data").val();

        let deo_data;

        try {
            deo_data = await data2deo(data);
            console.log(`DEO DATA:\n${deo_data}`);
            $('#deodata_result').html(escapeHtml(deo_data));
        }
        catch (e) {
            $('#deodata_result').html(`<b>${e.message}</b>`); 
        }

        let deo;
        try {
            deo = await odrl2deo(deo_data,policy);
            console.log(`DEO:\n${deo}`);
            $('#deo_result').html(escapeHtml(deo));
        }
        catch (e) {
            $('#deo_result').html(`<b>${e.message}</b>`); 
        }
        
        let modal;

        if (deo) {
            try {
                modal = await deo2modal(deo);
                console.log(`MODAL:\n${modal}`);
                $('#modal_result').html(escapeHtml(modal));
            }
            catch (e) {
                $('#modal_result').html(`<b>Unsatisfiable</b>`);  
                $('#result').html(IS_ERROR);  
            }
        }

        let normative;

        if (modal) {
            try {
                normative = await modal2normative(modal);
                console.log(`NORMATIVE:\n${normative}`);
                $('#normative_result').html(escapeHtml(normative));
            }
            catch (e) {
                $('#normative_result').html(`<b>Unsatisfiable</b>`);  
                $('#result').html(IS_ERROR);  
            }
        }

        if (normative) {
            try {
                const result = await normative2check(normative);
                console.log(`RESULT:\n${result}`);
                $('#result').html(IS_OK); 
            }
            catch (e) {
                $('#result').html(IS_ERROR);  
            }
        }
    });
});

async function data2deo(data) {
    const N3 = deodata_n3 + "\n#**data***\n\n" + data + "\n#**background***\n\n" + background_n3;
    const str = await eyereasoner.n3reasoner(N3,undefined, {
        output: 'derivations',
        outputType: 'string'
    });
    return str;
}

async function odrl2deo(data1,data2) {
    const N3 = deo_n3 + "\n#**data***\n\n" + data1 + "\n#**policies***\n\n" + data2 + "\n#**background***\n\n" + background_n3;
    const str = await eyereasoner.n3reasoner(N3,deo_query, {
        outputType: 'string'
    });
    return str;
}

async function deo2modal(data) {
    const N3 = modal_n3 + "\n#**data***\n\n" + data;
    const str = await eyereasoner.n3reasoner(N3,modal_query, {
        outputType: 'string'
    });
    return str;
}

async function modal2normative(data) {
    const N3 = deontic_compile + "\n#**data***\n\n" + data;
    const str = await eyereasoner.n3reasoner(N3,undefined, {
        output: 'none',
        outputType: 'string'
    });
    return str;
}

async function normative2check(data) {
    const str = await eyereasoner.n3reasoner(data,undefined, {
        output: 'none',
        outputType: 'string'
    });
    return str;
}

function escapeHtml(unsafe)
{
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;")
         .replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;")
         .replace(/\n/g,"<br>");
}

