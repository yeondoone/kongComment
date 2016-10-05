function captchaReload() {
    $('#captchaImg').removeAttr('src');
    setTimeout(function () {
        var someDate = new Date();
        someDate = someDate.getTime();
        $('#captchaImg').attr('src', '../board/captcha.php?ch=' + someDate);
    }, 1);
}

function addUpload() {
    var uploadBoxCount = $('#uploadBox').find('.file-upload').length;
    if (uploadBoxCount >= 5) {
        alert("업로드는 최대 5개만 지원합니다");
        return;
    }

    var addUploadBox = _.template(
        $("script.template").html()
    );

    $('#uploadBox:last').append(addUploadBox({idx: uploadBoxCount + 1}));
}

function uploadRemove(obj) {
    var target = $(obj);
    target.closest('.file-upload').remove();
}

$(document).ready(function () {
    var uploadBoxCount = $('#uploadBox').find('.file-upload').length;
    $('.file-upload:last').find('label').attr('for', 'attach' + uploadBoxCount);
    $('.file-upload:last').find('input[type=file]').attr('id', 'attach' + uploadBoxCount);

    if (cfgUploadFl == 'y') {
        $('#addUploadBtn').bind('click', function () {
            addUpload();
        });
    }

    if ($('.file-upload').length > 5) {
        $('.file-upload:last').remove();
    }

    $.validator.addMethod("checkCaptcha", function (value, element, fl) {
        var success = false;
        $.ajax({
            method: "POST",
            url: "../board/board_ps.php",
            data: {mode: 'captcha', 'captchaKey': value },
            dataType: 'text',
            cache: false,
            async: false,
        }).success(function (result) {
            if (result == 'true') {
                success = true;
            }
        }).error(function (e) {
            alert(e.responseText);
        });

        return success;
    }, "자동등록방지 문자가 틀렸습니다.");

    $("#frmWrite").validate({
        submitHandler: function (form) {
            if (cfgEditorFl == 'y') {
                oEditors.getById["editor"].exec("UPDATE_CONTENTS_FIELD", []);	// 에디터의 내용이 textarea에 적용됩니다.
            }

            form.submit();
        },
        rules: {
            private: 'required',
            contents: {
                required: function (textarea) {
                    if (cfgEditorFl == 'y') {
                        var editorcontent = oEditors.getById[textarea.id].getIR();	// 에디터의 내용 가져오기.
                        editorcontent = editorcontent.replace(/<(?!img).*?>/ig, '').replace('&nbsp;', '');  //이미지테그제외한 테그제거
                        return editorcontent.length === 0;
                    }
                    else {
                        return textarea.value.length === 0;
                    }
                }
            },
            writerNm: 'required',
            writerPw: 'required',
            subject: 'required',
            captchaKey: {
                required: true,
                checkCaptcha : true,
            },
            goodsPt: 'required',
        },
        messages: {
            writerNm: {
                required: '작성자를 입력해주세요.'
            },
            writerPw: {
                required: '비밀번호를 입력해주세요.'
            },
            subject: {
                required: '제목을 입력해주세요.'
            },
            contents: {
                required: '내용을 입력해주세요'
            },
            private: {
                required: '개인정보 수집 및 이용동의를 체크해주세요.'
            },
            captchaKey: {
                required: '자동등록방지 문자를 입력해주세요.',
            },
            goodsPt: {
                required: '평가를 체크해주세요.'
            },

        }
    })

    $('body').on('click','.js-select-remove',function(){
        $(this).closest('div.js-select-item').remove();
        $('.selected-info-text').show();
    })

    $('.btn-open-layer').bind('click', function (e) {
        if ($(this).attr('href') == '#addGoodsLayer') {
            $.ajax({
                method: "POST",
                cache: false,
                url: "../share/layer_goods_select.php",
                success: function (data) {
                    $('#addGoodsLayer').empty().append(data);
                    $('#addGoodsLayer').find('>div').center();
                },
                error: function (data) {
                    alert(data.message);
                    closeLayer();
                }
            });
        }
        else if ($(this).attr('href') == '#addOrderLayer') {
            var params = {
                bdId : bdId,
                bdSno : bdSno,
            };
            $.ajax({
                method: "POST",
                data : params,
                cache: false,
                url: "../share/layer_order_select.php",
                success: function (data) {
                    $('#addOrderLayer').empty().append(data);
                    $('#addOrderLayer').find('>div').center();
                },
                error: function (data) {
                    alert(data.message);
                    closeLayer();
                }
            });
        }
    });
});

function setAddGoods(frmData) {
    $.each(frmData.info, function (key, val) {
        var selectGoodsTblTr = _.template($('#selectGoodsTblTr').html());
        var param = {goodsNo: val.goodsNo, goodsImgageSrc: val.goodsImgageSrc, goodsName: val.goodsName, goodsPrice: val.goodsPrice};
        selectGoodstblTrHtml = selectGoodsTblTr(param);
    });
    $("#selectGoodsBox").empty();
    $("#selectGoodsBox").append(selectGoodstblTrHtml);
    $('.selected-info-text').hide();

    if(parent && parent!=this){
        parent.resize_frame(parent.document.getElementsByName(window.name)[0]);
    }
}

function setAddOrder(frmData) {
    $.each(frmData.info, function (key, val) {
        var selectGoodsTblTr = _.template($('#selectOrderTblTr').html());
        var param = {orderNo: val.orderNo, orderGoodsNo: val.orderGoodsNo, goodsImgageSrc: val.goodsImgageSrc, goodsName: val.goodsName, optionName:val.optionName,goodsPrice:val.goodsPrice,goodsNo : val.goodsNo};
        selectGoodstblTrHtml = selectGoodsTblTr(param);
    });
    $("#selectOrderBox").empty();
    $("#selectOrderBox").append(selectGoodstblTrHtml);
    $('.selected-info-text').hide();
    if(parent && parent!=this){
        parent.resize_frame(parent.document.getElementsByName(window.name)[0]);
    }
}
