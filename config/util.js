module.exports = {
    testId: function (id) {
        // 1 "验证通过!", 0 //校验不通过
        const format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
        //号码规则校验
        if (!format.test (id)) {
            return {'status': 0, 'msg': '身份证号码不合规'};
        }
        //区位码校验
        //出生年月日校验   前正则限制起始年份为1900;
        const year = id.substr (6, 4),//身份证年
            month = id.substr (10, 2),//身份证月
            date = id.substr (12, 2),//身份证日
            time = Date.parse (month + '-' + date + '-' + year),//身份证日期时间戳date
            now_time = Date.parse (new Date ()),//当前时间戳
            dates = (new Date (year, month, 0)).getDate ();//身份证当月天数
        if (time > now_time || date > dates) {
            return {'status': 0, 'msg': '出生日期不合规'}
        }
        //校验码判断
        const c = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];   //系数
        const b = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];  //校验码对照表
        const id_array = id.split ("");
        let sum = 0;
        for (let k = 0; k < 17; k++) {
            sum += parseInt (id_array[k]) * parseInt (c[k]);
        }
        if (id_array[17].toUpperCase () !== b[sum % 11].toUpperCase ()) {
            return {'status': 0, 'msg': '身份证校验码不合规'}
        }
        return {'status': 1, 'msg': '校验通过'}
    },
    isPhoneAvailable: function (phone) { //验证手机号码
        const myreg = /^[1][345678][0-9]{9}$/;
        return myreg.test (phone);
    },
    isNameAvailable: function (name) {
        const regName = /^[\u4e00-\u9fa5]{2,4}$/;
        return regName.test (name);
    },
    isIdCardNo:
    // $.validator.addMethod("identity", function (value, element) {
    //     return this.optional(element) || isIdCardNo(value);
    // }, "身份证号码格式不正确");
//增加身份证验证
        function (num) {
            const factorArr = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];
            const parityBit = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
            const varArray = [];
            let intValue;
            let lngProduct = 0;
            let intCheckDigit;
            const intStrLen = num.length;
            const idNumber = num;
            // initialize
            if ((intStrLen !== 15) && (intStrLen !== 18)) {
                return false;
            }
            // check and set value
            for (i = 0; i < intStrLen; i++) {
                varArray[i] = idNumber.charAt (i);
                if ((varArray[i] < '0' || varArray[i] > '9') && (i !== 17)) {
                    return false;
                } else if (i < 17) {
                    varArray[i] = varArray[i] * factorArr[i];
                }
            }

            if (intStrLen === 18) {
                //check date
                const date8 = idNumber.substring (6, 14);
                if (isDate8 (date8) === false) {
                    return false;
                }
                // calculate the sum of the products
                for (i = 0; i < 17; i++) {
                    lngProduct = lngProduct + varArray[i];
                }
                // calculate the check digit
                intCheckDigit = parityBit[lngProduct % 11];
                // check last digit
                if (varArray[17] !== intCheckDigit) {
                    return false;
                }
            } else {        //length is 15
                //check date
                const date6 = idNumber.substring (6, 12);
                if (isDate6 (date6) === false) {
                    return false;
                }
            }
            return true;
        }


};
