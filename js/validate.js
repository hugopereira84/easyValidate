$.fn.validateForm = function() {
    var email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
    var tel_regex = /^(((2|9))[0-9]{8})$/;
    var cp_regex = /^\d{4}$/;
    var cp_regex2 = /^\d{3}$/;
	
    
    var msgErrRequired      = 'O campo {nameField} é obrigatorio';
    var msgErrEmail         = 'O campo {nameField} está mal formatado';
    var msgErrPhone         = 'O campo {nameField} está mal preenchido';
    var msgErrPostalCode    = 'O campo {nameField} está inválido';
    var msgErrNif           = 'O campo {nameField} está inválido';
    var msgErrNumber        = 'O campo {nameField} apenas pode conter numeros';

    function validateRequire(valInput){
        return valInput.length > 0 ? 'ok' : 'ko';
    }
    
    function validateEmail(valInput){
        return email_regex.test(valInput) ? 'ok' : 'ko';
    }
    
    function validatePhone(valInput){
        return tel_regex.test(valInput) ? 'ok' : 'ko';
    }
    
    function validatePostalCodePart1(valInput){
        return cp_regex.test(valInput) ? 'ok' : 'ko';
    }
    function validatePostalCodePart2(valInput){
        return cp_regex2.test(valInput) ? 'ok' : 'ko';
    }
	
	function validateNumber(valField){
        return isNaN(valField) ? 'ko' : 'ok';
    }
    
    function isValidNIF(nif) { 
        var c;
        var checkDigit = 0;
        var IsNumeric = function(i) {
            return (/^\d+$/).test(i);
        };
        
        //Verifica se e' nulo, se e' numerico e se tem 9 digitos
        if (nif !== null && IsNumeric(nif) && nif.length == 9) {
        //Obtem o primeiro número do NIF
        c = nif.charAt(0);
        //Verifica se o primeiro número é (1, 2, 5, 6, 8 ou 9)
        if (c == '1' || c == '2' || c == '5' || c == '6' || c == '8' || c == '9') {
        //Calculo do Digito de Controle
        checkDigit = c * 9;
        var i = 0;
        for ( i = 2; i <= 8; i++) {
        checkDigit += nif.charAt(i - 1) * (10 - i);
        }
        checkDigit = 11 - (checkDigit % 11);
        //Se o digito de controle é maior que dez, coloca-o a zero
        if (checkDigit >= 10)
        checkDigit = 0;
        //Compara o digito de controle com o último numero do NIF
        //Se igual, o NIF é válido.
        if (checkDigit == nif.charAt(8))
        return true;
        }
        }
        return false;
    }
    function validateNif(valInput){
        return !isValidNIF(valInput) > 0 ? 'ko' : 'ok';
    }
     
    
    
    /** FUNCOES AUXILIARES **/
    function getObjects(obj, key, val) {
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(getObjects(obj[i], key, val));
            } else if (i == key && obj[key] == val) {
                objects.push(obj);
            }
        }
        return objects;
    }
    /** FUNCOES AUXILIARES **/
    
    $(this).on('submit',function(e){
        var $form           = $(this);
        var $arrFormInput   = $form.find('input:not([type=submit])');
        var divWithErr      = 'errValidationForm';
        
        //REMOVER TODAS AS MENSAGENS DE ERROS
        $form.find('.'+divWithErr).remove();

        if ($form.data('submitted') === true) {
            // Previously submitted - don't submit again
            e.preventDefault();
        }else{            
            // VALIDAR FORMULARIO AQUI E SÓ SE NAO DER ERROS, É QUE FAZ O FORM DATA
            var errFlag = 0;
            var arrAllErrField = {};
            var domObj = {};
            
            //console.dir($arrFormInput);
            
            //VALIDACOES DE CAMPOS AQUI
            $arrFormInput.each(function( index ) {
                var $elmInput   = $(this);
                var classAttr   = $elmInput.attr('class');
                var nameAttr    = $elmInput.attr('name');
                var idAttr      = $elmInput.attr('id');
                var valField    = $elmInput.val();
                
                
                if(classAttr !== undefined){
                    var indexPos = classAttr.indexOf("validate");
                    if(indexPos !== -1){
                        
                        var arrErrField = {};
                        
                        //TEMOS QUE VALIDAR O CAMPO
                        var validationsToRun = classAttr.substring(classAttr.indexOf("[")+1,classAttr.lastIndexOf("]"));
                        var arrValidationsToRun = validationsToRun.split(",");
                        
                        if(arrValidationsToRun.length > 0 ){
                            $.each(arrValidationsToRun , function(key, value) { 
                                var resultVald,msgErr;
                                
                                switch($.trim(value)) {
                                    case 'required':
                                        resultVald  = validateRequire(valField);
					msgErr      = nameAttr !== undefined && nameAttr.length > 0 ? msgErrRequired.replace("{nameField}", nameAttr) :  msgErrRequired.replace("{nameField}", '') ;
                                        break;
                                    case 'date':
                                        
                                        break;
                                    case 'email':
                                        resultVald  = validateEmail(valField);
					msgErr      = nameAttr !== undefined && nameAttr.length > 0 ? msgErrEmail.replace("{nameField}", nameAttr) :  msgErrEmail.replace("{nameField}", '') ;
                                        break;
                                    case 'number3':
                                    case 'number9':
					resultVald  = validateNumber(valField);
                                        msgErr      = nameAttr !== undefined && nameAttr.length > 0 ? msgErrNumber.replace("{nameField}", nameAttr) :  msgErrNumber.replace("{nameField}", '') ;
                                        break;
                                    case 'phone':
                                        resultVald  = validatePhone(valField);
					msgErr      = nameAttr !== undefined && nameAttr.length > 0 ? msgErrPhone.replace("{nameField}", nameAttr) :  msgErrPhone.replace("{nameField}", '') ;
                                        break;
                                    case 'pc_part1':
                                        resultVald  = validatePostalCodePart1(valField);
                                        msgErr      = nameAttr !== undefined && nameAttr.length > 0 ? msgErrPostalCode.replace("{nameField}", nameAttr) :  msgErrPostalCode.replace("{nameField}", '') ;
                                        break;
                                    case 'pc_part2':
                                        resultVald  = validatePostalCodePart2(valField);
					msgErr      = nameAttr !== undefined && nameAttr.length > 0 ? msgErrPostalCode.replace("{nameField}", nameAttr) :  msgErrPostalCode.replace("{nameField}", '') ;
                                        break;
                                    case 'nif':
                                        resultVald  = validateNif(valField);
					msgErr      = nameAttr !== undefined && nameAttr.length > 0 ? msgErrNif.replace("{nameField}", nameAttr) :  msgErrNif.replace("{nameField}", '') ;
                                        break;
                                        
                                }
                                if(resultVald == 'ko'){
                                    errFlag = 1;
                                    
                                    if(typeof arrAllErrField[index] === 'undefined') {
                                        arrAllErrField[index] = {};
                                        domObj[index] = {};
                                    }
                                    arrAllErrField[index][key] = {'id': idAttr, 'msgErr': msgErr, 'validation': value, 'index':index, 'key':key };
                                    domObj[index][key] = $elmInput;
                                }
                            });
                            
                        }
                    }
                }                
            });
            
            //TRATAR OS ERROS E VER QUE SE FAZ COM ELES
            $.each(arrAllErrField, function( index, value ) {
                $.each(value, function( key, value ) {
                    var $showElm = domObj[index][key];
                    
                    if(value.validation != 'pc_part1' && value.validation != 'pc_part2'){
                        $( "<p class='"+divWithErr+" "+value.validation+"'>"+value.msgErr+"</p>" ).insertAfter( $showElm );
                    }
                }); 
            });        
            
            
            //TRATAR OS AGRUPAMENTOS
            var strAllErrField =  JSON.stringify(arrAllErrField);
            var infoObjPc2 = getObjects(arrAllErrField, 'validation', 'pc_part2');
            if (strAllErrField.indexOf("pc_part1") >= 0 || strAllErrField.indexOf("pc_part2") >= 0){
				$elmToPutPostalCodeErr = $form.find("[class*='pc_part2']");
                $( "<p class='"+divWithErr+" postalcodeGroup'>"+msgErrPostalCode.replace("{nameField}", 'código postal')+"</p>" ).insertAfter( $elmToPutPostalCodeErr );
            }
                
           
            
            //OUTRAS VALIDACOES
                $form.find("[class*='number3']").keyup(function() { 
                        var classAttr = $(this).attr('class');
                        var indexPos = classAttr.indexOf("validate");
                        if(indexPos !== -1){
                                var number = $(this).val(); 
                                if(!(/^\d{0,3}$/.test(number))) { 
                                        $(this).val(number.match(/\d{0,3}/)); 
                                }
                        }

                }); 
                $form.find("[class*='number9']").keyup(function() { 
                        var classAttr = $(this).attr('class');
                        var indexPos = classAttr.indexOf("validate");
                        if(indexPos !== -1){
                                var number = $(this).val(); 
                                if(!(/^\d{0,9}$/.test(number))) { 
                                        $(this).val(number.match(/\d{0,9}/)); 
                                }
                        }

                }); 
            //OUTRAS VALIDACOES
            
            if(errFlag == 0){
                // Mark it so that the next submit can be ignored
                $form.data('submitted', true);
            }else{
                e.preventDefault();
            }
            
        }
    });

    // Keep chainability
    return this;
};