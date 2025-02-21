let background_n3;
let deodata_n3;
let deo_n3;
let deo_query;
let modal_n3;
let modal_query;
let deontic_compile;

$( document ).ready(async function() {
    console.log( "document loaded" );

    load_files();

    $('#execute').on("click", async () => {
        const IS_OK = '&#x1F60C;';
        const IS_ERROR = '&#x1F631;';
        const IS_BUSY = '&#x1F634;';
        const policy = $("#policy").val();
        const data = $("#data").val();

        let deo_data;

        $('#result').html(IS_BUSY);  

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

async function getFile(file) {
    try {
        const base = `https://raw.githubusercontent.com/KNowledgeOnWebScale/n3s-policy-consistency-checker/refs/heads/main/src/`;
        console.log(`GET ${base}${file}`);
        const res = await fetch(`${base}${file}`);
        
        if (res.ok) {
            return await res.text();
        }
        else {
            console.error(res.message);
            return '';
        }
    }
    catch (e) {
        console.error(e.message);
        return '';
    }
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

async function load_files() {
    background_n3 = await getFile('n3/eye/background.n3');
    deodata_n3 = await getFile('n3/eye/data2deo.n3');
    deo_n3 = await getFile('n3/eye/odrl2deo.n3');
    deo_query = await getFile('n3/eye/odrl_query.n3');
    modal_n3 = await getFile('n3/eye/compiler.n3');
    modal_query = await getFile('n3/eye/query.n3');
    deontic_compile = await getFile('n3s/deontic.n3s');
    $('#execute').removeAttr("disabled");
}
