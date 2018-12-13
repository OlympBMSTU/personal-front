const fioRegExp = /[ЁёА-Яа-я- ]+/;
const dateRegExp = /[12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])/g;
const telRegExp = /\+\d[\d\-]+/g;
const eduRegExp = /[\dЁёА-Яа-я- №.,]+/g;

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
        }
    return urlparameter;
}

if (!NodeList.prototype.forEach && Array.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}
  

let recoverCaptchaId = -1;
let registerCaptchaId = -2;

let detailsCaptchaId = -3;

if (!navigator.cookieEnabled) {
    alert( 'Включите cookie для работы с этим сайтом' );
}

// LIB
function resetPage() {
    let parts = document.getElementsByClassName('part');
    Array.prototype.forEach.call(parts, function(pt) {
        pt.style.display = 'none';
    });


    let inputs = document.getElementsByClassName('input');
    Array.prototype.forEach.call(inputs, function(el) {
        el.style.backgroundColor = "#ffffff";
    });

    /*let Node = document.getElementById("registerCaptcha");
    while (Node.firstChild) {
        Node.removeChild(Node.firstChild);
    }
    Node = document.getElementById("recoverCaptcha");
    while (Node.firstChild) {
        Node.removeChild(Node.firstChild);
    }*/
}


function resetFields() {
    let fields = document.getElementsByClassName('input');
    Array.prototype.forEach.call(fields, function(el) {
        el.style.backgroundColor = "#ffffff";
    });
}

function toRegister() {
    resetPage();
    if (registerCaptchaId < 0) registerCaptchaId = grecaptcha.render('registerCaptcha', {'sitekey' : '6LfhW20UAAAAADa9DGJSwkbulFIWSKhkSS-N0Glo'});
    document.getElementById('register_part').style.display = 'block';
}

function recurOlymp(res, curIdx, next) {
    if (next.data.next.length == 0) {
	return true;
    } else {
	res[curIdx].line.push(next.data.selected[0]);
        recurOlymp(res, curIdx, next.data.next[0]); 
    }
}

function prettyOlymp(olymp) {
    let res = [];
    let mainIdx = 0;

    olymp.forEach(function(el, i) {
        let top = el.olimp;

	if ( top === 'Инженерное дело (физика или информатика)') {
            for (var k = 0; k < el.data.selected.length; k++) {
		res.push({olimp: top, line: [top, el.data.selected[k]]});
		recurOlymp(res, mainIdx, el.data.next[k]);
		mainIdx = mainIdx + 1;
            }
        } else {
	    res.push({olimp: top, line: [top]});
	    if (el.data.next) {
                res[mainIdx].line.push(el.data.selected[0]);
	        recurOlymp(res, mainIdx, el.data.next[0]);
            }
        }
        mainIdx = mainIdx + 1;
    });
    console.log(res);
    return(res);
}

function toInfo() {
    if (hasCookie('bmstuOlympAuth')) {
        api.requestData("info", "GET")
        .then(function(response) {
            if (response.res_code === 'OK') {
                resetPage();

                document.getElementById('fio_info').innerHTML = response.res_data.login;
                document.getElementById('email_info').innerHTML = response.res_data.email;

                document.getElementById('info_part').style.display = 'block';
                
                if (response.res_data.isFull) {
                    document.getElementById('details_form').style.display = 'none';
		    document.getElementById('details_filled').style.display = 'block';
                } else {
                    //detailsCaptchaId = grecaptcha.render('detailsCaptcha', {'sitekey' : '6LfhW20UAAAAADa9DGJSwkbulFIWSKhkSS-N0Glo'});
                    document.getElementById('details_form').style.display = 'block';
                    document.getElementById('details_filled').style.display = 'none';
                }

                document.getElementById('olymps_header').style.display = 'block';
                if (!response.res_data.hasOlymp) {
		    document.getElementById('olymps_form').style.display = 'block';
	            document.getElementById('olymps_filled').style.display = 'none';
		} else {
		    let saved = prettyOlymp(response.res_data.hasOlymp);
		    let saved_div = document.getElementById('saved_olymps');
                    saved_div.innerHTML = '';
		    saved.forEach(function(el, i) {
			saved_div.innerHTML = saved_div.innerHTML + '<br>';
			el.line.forEach(function(li, i) {
			    saved_div.innerHTML = saved_div.innerHTML + ' - ' + li;
                        });
                        saved_div.innerHTML = saved_div.innerHTML + '<br>';
		    });

                    document.getElementById('olymps_form').style.display = 'none';
                    document.getElementById('olymps_filled').style.display = 'block';
		}
            } else {
                deleteCookie('bmstuOlympAuth');
                toLogin();
            }
        });
    } else {
        toLogin();
    }
}

function toLogin() {
    resetPage();
    document.getElementById('login_part').style.display = 'block';
}

function toRecover() {
    resetPage();
    if (recoverCaptchaId < 0) recoverCaptchaId = grecaptcha.render('recoverCaptcha', {'sitekey' : '6LfhW20UAAAAADa9DGJSwkbulFIWSKhkSS-N0Glo'});
    document.getElementById('recover_part').style.display = 'block';
}

function showError (msg, dissolve = false) {
    const err_field = document.getElementById("error");
    err_field.innerHTML = msg;

    if (dissolve) {
        setTimeout(function() { document.getElementById("error").innerHTML='' }, 7000);
    }
}



// BTNS
const to_recover_pass = document.getElementById("btn_recover_pass");
to_recover_pass.onclick = function() {
    showError('');
    toRecover();
    return false;
}

const to_register_form = document.getElementById("btn_start_register");
to_register_form.onclick = function() {
    showError('');
    toRegister();
    return false;
}

const rec_to_login_form = document.getElementById("btn_rec_to_login");
rec_to_login_form.onclick = function() {
    showError('');
    toLogin();
    return false;
}

const reg_to_login_form = document.getElementById("btn_reg_to_login");
reg_to_login_form.onclick = function() {
    showError('');
    toLogin();
    return false;
}

const logout_in_info = document.getElementById("btn_logout");
logout_in_info.onclick = function() {
    showError('');
    toLogin();
    deleteCookie('bmstuOlympAuth');
    return false;
}

const register_form = document.getElementById("register_form");
register_form.addEventListener('submit', event => {
    event.preventDefault();

    resetFields();

    const login_input = document.getElementById("reg_login_input");
    const login = login_input.value;

    const pass_input = document.getElementById("reg_password_input");
    const pass = pass_input.value;

    const repass_input = document.getElementById("reg_repassword_input");
    const repass = repass_input.value;

    const email_input = document.getElementById("reg_email_input");
    const email = email_input.value;

    const familia_input = document.getElementById("reg_familia_input");
    const familia = familia_input.value;

    const imia_input = document.getElementById("reg_imia_input");
    const imia = imia_input.value;

    const otchestvo_input = document.getElementById("reg_otchestvo_input");
    const otchestvo = otchestvo_input.value;


    showError('');

    let isValid = true;
    if (login === '') {
        login_input.style.backgroundColor = "#ffbbbb";
        isValid = false;
    }

    if (pass.length < 8) {
        pass_input.style.backgroundColor = "#ffbbbb";
        showError('Пароль должен содержать минимум 8 символов');
        isValid = false;
    }

    if (repass.length < 8) {
        repass_input.style.backgroundColor = "#ffbbbb";
        showError('Пароль должен содержать минимум 8 символов');
        isValid = false;
    }

    let familia_check = familia.match(fioRegExp);
    if (familia === '' || !familia_check || familia_check[0].length != familia.length) {
        familia_input.style.backgroundColor = "#ffbbbb";
        showError('В ФИО допускаются только русские буквы, пробелы и дефисы');
        isValid = false;
    }

    let imia_check = imia.match(fioRegExp);
    if (imia === '' || !imia_check || imia_check[0].length != imia.length) {
        imia_input.style.backgroundColor = "#ffbbbb";
        showError('В ФИО допускаются только русские буквы, пробелы и дефисы');
        isValid = false;
    }

    if (otchestvo  != '') {
        let otchestvo_check = otchestvo.match(fioRegExp);
        if (!otchestvo_check || !otchestvo_check || otchestvo_check[0].length != otchestvo.length) {
            otchestvo_input.style.backgroundColor = "#ffbbbb";
            showError('В ФИО допускаются только русские буквы, пробелы и дефисы');
            isValid = false;
        }
    }

    if (email === '') {
        email_input.style.backgroundColor = "#ffbbbb";
        isValid = false;
    }


    if (pass != repass) { 
        pass_input.style.backgroundColor = "#ffbbbb";
        repass_input.style.backgroundColor = "#ffbbbb";
        isValid = false;

        showError('Пароли не совпадают');

        return false;
    }
    
    let captcha = grecaptcha.getResponse(registerCaptchaId);
    
    if (captcha === '') {
        showError('Заполните поле reCaptcha');
        isValid = false;
	grecaptcha.reset(registerCaptchaId);
        return false;
    }

	if (isValid){
        api.requestData("register", "POST", {login: login, password: pass, familia: familia, imia: imia, otchestvo: otchestvo, email: email, 'g-recaptcha-response': captcha})
        .then(function(response) {
            
            if (response.res_code === 'OK') {
                showError(response.res_msg, true);
                toLogin();
            } else {
                showError(response.res_msg);
		grecaptcha.reset(registerCaptchaId);
            }
        });
    }	
});

const change_passsword_form = document.getElementById("change_passsword_form");
change_passsword_form.addEventListener('submit', event => {
    event.preventDefault();

    resetFields();

    const old_pass_input = document.getElementById("cng_password_old_input");
    const old_pass = old_pass_input.value;

    const pass_input = document.getElementById("cng_password_new_input");
    const pass = pass_input.value;

    const repass_input = document.getElementById("cng_password_renew_input");
    const repass = repass_input.value;


    showError('');

    let isValid = true;

    if (old_pass.length < 8) {
        old_pass_input.style.backgroundColor = "#ffbbbb";
        showError('Пароль должен содержать минимум 8 символов');
        isValid = false;
    }

    if (pass.length < 8) {
        pass_input.style.backgroundColor = "#ffbbbb";
        showError('Пароль должен содержать минимум 8 символов');
        isValid = false;
    }

    if (repass.length < 8) {
        repass_input.style.backgroundColor = "#ffbbbb";
        showError('Пароль должен содержать минимум 8 символов');
        isValid = false;
    }


    if (pass != repass) { 
        pass_input.style.backgroundColor = "#ffbbbb";
        repass_input.style.backgroundColor = "#ffbbbb";
        isValid = false;

        showError('Пароли не совпадают');

        return false;
    }

	if (isValid){
        api.requestData("changepassword", "POST", {password: old_pass, newpassword: pass} )
        .then(function(response) {
            
            if (response.res_code === 'OK') {
                showError(response.res_msg, true);
                toLogin();
            } else {
                showError(response.res_msg);
            }
        });
    }	
});

const login_form = document.getElementById("login_form");
login_form.addEventListener('submit', event => {
    event.preventDefault();

    const login_input = document.getElementById("log_login_input");
    const login = login_input.value;

    const pass_input = document.getElementById("log_password_input");
    const pass = pass_input.value;

    login_input.style.backgroundColor = "#ffffff";
    pass_input.style.backgroundColor = "#ffffff";

    showError('');

    let isValid = true;
    if (login === '') {
        login_input.style.backgroundColor = "#ffbbbb";
        isValid = false;
    }

    if (pass.length < 8) {
        pass_input.style.backgroundColor = "#ffbbbb";
        isValid = false;
        showError('Пароль должен содержать минимум 8 символов');
    }
			
	if (isValid){
        api.requestData("login", "POST", {login: login, password: pass})
        .then(function(response) {
            if (response.res_code === 'OK') {
                showError(response.res_msg, true);

                setCookie('bmstuOlympAuth', response.res_data, {expires: 84000});

		let redir = getUrlParam("redirect", "");
		if (redir === "") {
	                toInfo();
		} else {
			window.location.replace(redir);
		}
            } else {
                showError(response.res_msg);
            }
        });
    }	
});

const recover_form = document.getElementById("recover_form");
recover_form.addEventListener('submit', event => {
    event.preventDefault();

    const login_input = document.getElementById("rec_login_input");
    const login = login_input.value;

    const email_input = document.getElementById("rec_email_input");
    const email = email_input.value;

    resetFields();
    showError('');

    let isValid = true;
    if (login === '') {
        login_input.style.backgroundColor = "#ffbbbb";
        isValid = false;
    }

    if (email === '') {
        email_input.style.backgroundColor = "#ffbbbb";
        isValid = false;
    }

	let captcha = grecaptcha.getResponse(recoverCaptchaId);
    
    if (captcha === '') {
        showError('Заполните поле reCaptcha');
        isValid = false;
	grecaptcha.reset(recoverCaptchaId);

        return false;
    }		

	if (isValid){
        api.requestData("recover", "POST", {login: login, email: email, 'g-recaptcha-response': captcha})
        .then(function(response) {
            if (response.res_code === 'OK') {
                showError(response.res_msg);

                toLogin();
            } else {
        	grecaptcha.reset(recoverCaptchaId);
	        showError(response.res_msg);
            }
        });
    }	
});

const details_form = document.getElementById("details_form");
details_form.addEventListener('submit', event => {
    event.preventDefault();

    resetFields();
    let person = {};

    const birthdate_input = document.getElementsByName("birthdate")[0];
    person.birthdate = birthdate_input.value;
    console.log(person.birthdate);
    
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
    

    const prove_input = document.getElementsByName("prove")[0];
    person.prove = prove_input.checked;

    const agree_input = document.getElementsByName("agree")[0];
    person.agree = agree_input.checked;

    showError('');
    let isValid = true;

    let bday_check = person.birthdate.match(dateRegExp);
    if (person.birthdate === '' || !bday_check || bday_check.length != 1) {
        birthdate_input.style.backgroundColor = "#ffbbbb";
	showError('Дата должна быть указана во встроенном календаре или строкой в формате ГГГГ-ММ-ДД');
        isValid = false;
    }

    if (person.document.num === '') {
        document_num_input.style.backgroundColor = "#ffbbbb";
        isValid = false;
    }

    if (person.document.issuer === '') {
        document_issuer_input.style.backgroundColor = "#ffbbbb";
        isValid = false;
    }

    let iday_check = person.document.issue_date.match(dateRegExp);
    if (person.document.issue_date === '' || !iday_check || iday_check.length != 1) {
        document_issue_date_input.style.backgroundColor = "#ffbbbb";
	if (isValid) showError('Дата должна быть указана во встроенном календаре или строкой в формате ГГГГ-ММ-ДД');
        isValid = false;
    }

    let tel_check = person.tel.match(telRegExp);
    if (person.tel === '' || !tel_check || tel_check.length != 1) {
        tel_input.style.backgroundColor = "#ffbbbb";
        isValid = false;
    }

    let edushort_check = person.education.eduplace.shortname.match(eduRegExp);
    if (person.education.eduplace.shortname.eduplace === '' || !edushort_check || edushort_check[0].length != person.education.eduplace.shortname.length) {
        education_eduplace_shortname_input.style.backgroundColor = "#ffbbbb";
        if (isValid) showError('Допускаются только русские буквы, пробелы и знаки . , № -');
        isValid = false;
    }

    let region_check = person.education.eduplace.address.region.match(eduRegExp);
    if (person.education.eduplace.address.region === '' || !region_check || region_check[0].length != person.education.eduplace.address.region.length) {
        education_eduplace_address_region_input.style.backgroundColor = "#ffbbbb";
        if (isValid) showError('Допускаются только русские буквы, пробелы и знаки . , № -');
        isValid = false;
    }

    let street_check = person.education.eduplace.address.street.match(eduRegExp);
    if (person.education.eduplace.address.street === '' || !street_check || street_check[0].length != person.education.eduplace.address.street.length) {
        education_eduplace_address_street_input.style.backgroundColor = "#ffbbbb";
        if (isValid) showError('Допускаются только русские буквы, пробелы и знаки . , № -');
        isValid = false;
    }

    let house_check = person.education.eduplace.address.house.match(eduRegExp);
    if (person.education.eduplace.address.house === '' || !house_check || house_check[0].length != person.education.eduplace.address.house.length) {
        education_eduplace_address_house_input.style.backgroundColor = "#ffbbbb";
        if (isValid) showError('Допускаются только русские буквы, пробелы и знаки . , № -');
        isValid = false;
    }

    if (!person.prove) {
        prove_input.style.backgroundColor = "#ffbbbb";
        if (isValid) showError('Установите все галочки');
        isValid = false;
    }

    if (!person.agree) {
        agree_input.style.backgroundColor = "#ffbbbb";
        if (isValid) showError('Установите все галочки');
        isValid = false;
    }

	if (isValid){
        if (hasCookie('bmstuOlympAuth')) {
            api.requestData("info", "GET")
            .then(function(response) {
                if (response.res_code === 'OK') {
                    

                    let result = {
                        'person[outer_id]': response.res_data.id,
                        'person[fio][lastname]': response.res_data.familia,
                        'person[fio][firstname]': response.res_data.imia,
                        'person[fio][middlename]': response.res_data.otchestvo,
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
                        'person[contact][new1][value_]': response.res_data.email,
                        'person[contact][new1][relation_type]': "",
                        'person[contact][new1][comment_]': "",
                        'person[contact][new2][id]': "",
                        'person[contact][new2][value_]': person.tel,
                        'person[contact][new2][relation_type]': "",
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
            
                    api.requestData("details", "POST", {person: result})
                    .then(function(response) {
                        showError(response.res_msg);
                        toInfo();
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
    //showError("Для работы с системой рекомендуется использовать браузеры Google Chrome или Mozzila Firefox последних версий", true);
    toInfo();
}
