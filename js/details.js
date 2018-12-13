const fioRegExp = /[А-Яа-я- ]+/;

let detailsCaptchaId;

if (!navigator.cookieEnabled) {
    alert( 'Включите cookie для работы с этим сайтом' );
}

// LIB
function resetPage() {
    for (let pt of document.getElementsByClassName('part')) {
        pt.style.display = 'none';
    };
    for (let el of document.getElementsByTagName('input')) {
        el.style.backgroundColor = "#ffffff";
    };

    let myNode = document.getElementById("detailsCaptcha");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}

function resetFields() {
    for (let el of document.getElementsByTagName('input')) {
        el.style.backgroundColor = "#ffffff";
    };
}

function showError (msg, dissolve = false) {
    const err_field = document.getElementById("error");
    err_field.innerHTML = msg;

    if (dissolve) {
        setTimeout(function() { document.getElementById("error").innerHTML='' }, 7000);
    }
}



// BTNS

const register_form = document.getElementById("details_form");
register_form.addEventListener('submit', event => {
    event.preventDefault();

    resetFields();
    let person = {};

    const birthdate_input = document.getElementsByName("birthdate")[0];
    person.birthdate = birthdate_input.value;

    
    const gender_input = document.getElementsByName("gender")[0];
    person.gender = gender_input.value;

    
    person.citizenship = {};
    const citizenship_citizenship_input = document.getElementsByName("citizenship.citizenship")[0];
    person.citizenship.citizenship = citizenship_citizenship_input.value;
    
    const citizenship_country_code_input = document.getElementsByName("citizenship.country_code")[0];
    person.citizenship.country_code = citizenship_country_code_input.value;
    
    
    person.document = {};
    const document_type_input = document.getElementsByName("document.type")[0];
    person.document.type = document_type_input.value;
    
    const document_series_input = document.getElementsByName("document.series")[0];
    person.document.series = document_series_input.value;
    
    const document_num_input = document.getElementsByName("document.num")[0];
    person.document.num = document_num_input.value;
    
    const document_issuer_input = document.getElementsByName("document.issuer")[0];
    person.document.issuer = document_issuer_input.value;
    
    const document_issue_date_input = document.getElementsByName("document.issue_date")[0];
    person.document.issue_date = document_issue_date_input.value;

    
    const tel_input = document.getElementsByName("tel")[0];
    person.tel = tel_input.value;

    
    person.education = {};
    const education_class_num_input = document.getElementsByName("education.class_num")[0];
    person.education.class_num = education_class_num_input.value;
    
    person.education.eduplace = {};
    const education_eduplace_shortname_input = document.getElementsByName("education.eduplace.shortname")[0];
    person.education.eduplace.shortname = education_eduplace_shortname_input.value;

    person.education.eduplace.address = {};
    const education_eduplace_address_country_code_input = document.getElementsByName("education.eduplace.address.country_code")[0];
    person.education.eduplace.address.country_code = education_eduplace_address_country_code_input.value;

    const education_eduplace_address_region_input = document.getElementsByName("education.eduplace.address.region")[0];
    person.education.eduplace.address.region = education_eduplace_address_region_input.value;

    const education_eduplace_address_post_index_input = document.getElementsByName("education.eduplace.address.post_index")[0];
    person.education.eduplace.address.post_index = education_eduplace_address_post_index_input.value;

    const education_eduplace_address_street_input = document.getElementsByName("education.eduplace.address.street")[0];
    person.education.eduplace.address.street = education_eduplace_address_street_input.value;
    
    const education_eduplace_address_house_input = document.getElementsByName("education.eduplace.address.house")[0];
    person.education.eduplace.address.house = education_eduplace_address_house_input.value;
    
    const education_eduplace_address_building_input = document.getElementsByName("education.eduplace.address.building")[0];
    person.education.eduplace.address.building = education_eduplace_address_building_input.value;
    

    const agree_input = document.getElementsByName("agree")[0];
    person.agree = agree_input.value;

    showError('');
    let isValid = true;

    let captcha = grecaptcha.getResponse(registerCaptchaId);
    
    if (captcha === '') {
        showError('Заполните поле reCaptcha');
        //isValid = false;

        //return false;
    }

	if (isValid){
        if (hasCookie('bmstuOlympAuth')) {
            api.requestData("info", "GET")
            .then(function(response) {
                if (response.res_code === 'OK') {
                    response.res_data.login;

                    let result = {
                        'person[outer_id]': 1,
                        'person[fio][lastname]': "Иван-Ов",
                        'person[fio][firstname]': "Иван",
                        'person[fio][middlename]': "",
                        'person[birthdate]': person.birthdate,
                        'person[gender]': person.gender,
                        'person[citizenship][citizenship]': person.citizenship.citizenship,
                        'person[citizenship][country_code]': person.citizenship.country_code,
                        'person[identity][placeholder][document][type]': person.document.type,
                        'person[identity][placeholder][document][series]': person.document.series,
                        'person[identity][placeholder][document][num]': person.document.num,
                        'person[identity][placeholder][document][issuer]': person.document.issuer,
                        'person[identity][placeholder][document][issue_date]': person.document.issue_date,
                        'person[contact][new1][id]': "",
                        'person[contact][new1][value_]': "test1@mail.ru",
                        'person[contact][new1][relation_type]': "",
                        'person[contact][new1][comment_]': "",
                        'person[contact][new2][id]': "",
                        'person[contact][new2][value_]': person.tel,
                        'person[contact][new2][relation_type]': "family.mother",
                        'person[contact][new2][comment_]': "",
                        'person[education][new][education_single_block][class_num]': person.education.class_num,
                        'person[education][new][eduplace][shortname]': person.education.eduplace.shortname,
                        'person[education][new][eduplace][address][country_code]': person.education.eduplace.address.country_code,
                        'person[education][new][eduplace][address][region]': person.education.eduplace.address.region,
                        'person[education][new][eduplace][address][post_index]': person.education.eduplace.address.post_index,
                        'person[education][new][eduplace][address][street]': person.education.eduplace.address.street,
                        'person[education][new][eduplace][address][house]': person.education.eduplace.address.house,
                        'person[education][new][eduplace][address][building]': person.education.eduplace.address.building,
                        'agree': person.agree
                    }
            
                    api.requestData("details", "POST", {person: result, 'g-recaptcha-response': captcha})
                    .then(function(response) {
                        
                    });
                } else {
                    deleteCookie('bmstuOlympAuth');
                    toLogin();
                }
            });
        } else {
            toLogin();
        }
        
    }	
});

window.onload = function() {
    resetPage();
    registerCaptchaId = grecaptcha.render('detailsCaptcha', {'sitekey' : '6LfhW20UAAAAADa9DGJSwkbulFIWSKhkSS-N0Glo'});
    document.getElementById('details_part').style.display = 'block';
}