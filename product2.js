const domain = 'http://35.225.243.133';
$(document).ready(function () {
    $('.drag').click(function () {
        $('.upload').click();
    })
    if (!localStorage.getItem('token')) {
        window.location = 'pickbazar3.html';
        return
    }
    $.ajax({
        url: `${domain}/api/categories/`,
        method: 'GET',
        success: function (response) {
            let select_element = document.querySelector('select[name="category"]');
            for (let category_data of response) {

                let option = document.createElement('option');
                option.value = category_data.id;
                option.innerText = category_data.title;
                select_element.appendChild(option);
            }
        },
        error: function (error_response) {
            alert('Error bas verdi');
        }
    })
    document.querySelector('#form-add-product').addEventListener('submit', function (event) {
        event.preventDefault();
        let submitButton = $('.addcreate').val();
        let requestMethod;
        let requestUrl;
        console.log(submitButton)
        if (submitButton === 'Uptade Product') {
            let id=this.getAttribute('product_id');
            console.log(id);
            console.log('put');
            requestMethod = 'PUT';
            requestUrl = `${domain}/api/products/${id}/`;
        }
        else {
            // let id=this.getAttribute('product_id');
            // console.log(id);
            // console.log('post');
            requestMethod = "POST";
            requestUrl = `${domain}/api/products/`;
        }
        let formData = new FormData(this);
        // document.querySelectorAll('.form-add-product input,.form-add-product textarea,.form-add-product select').forEach((input) => {
        //     formData[input.getAttribute('name')] = input.value;
        // });
        document.querySelectorAll('.form-add-product small').forEach((small_tag) => {
            small_tag.innerHTML = '';
        })
        $.ajax({
            url: requestUrl,
            method: requestMethod,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`,
            },
            success: function (response) {
                console.log(response);
                alert('yes');
            },
            error: function (error_response) {
                if (error_response.status == 401) {
                    localStorage.removeItem('token');
                    window.location = 'pickbazar3.html';
                    return
                }
                alert("no");
                let error_messages = error_response.responseJSON;
                console.log(error_response);
                console.log(error_messages);

                for (let message_name in error_messages) {
                    let input = document.querySelector(`[name="${message_name}"`);
                    if (input) {
                        let small_tag = input.parentElement.querySelector('.form-add-product small');
                        small_tag.innerText = error_messages[message_name];
                    }
                }
            }
        });
    });
    if (localStorage.getItem('token')) {
        $.ajax({
            url: 'http://35.225.243.133/api/own-products/',
            method: 'GET',
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`,
            },
            success: function (response) {
                console.log(response);
                for (let product of response) {
                    $('.picturess').append(` 

                    <div class="col-lg-3 col-xl-3 col-md-4 col-12 col-sm-6 pictures">
                    <div class=" card" product_id="${product.id}" data-toggle="modal" data-target="#exampleModal1"
                        style="width: 13rem;">
                        <img class=" shekil" style="height: 220px;"
                            src="${product.main_image}"
                            alt="Card image cap">
                        <div class="card-body">
                            <h6 class="cardname">${product.title}</h6>
                            <h6 class="cardh6"><span class="cardlb">${product.unit}</span>  <span>${product.amount_by_unit}</span></h6>
                            <p class="cardmoney">$ ${product.price}</p>
                        </div>
                        <p class="carddescription d-none">${product.description}</p>
                        <p class="cardamount d-none">${product.amount_by_unit}</p>
                        <p class="carddiscountprice d-none">${product.discount_price}</p>
                        <p class="cardcategory d-none">${product.category.id}</p>
                    </div>
                </div>
  `);
                    var card = document.getElementsByClassName("card");
                    for (var i = 0; i < card.length; i++) {
                        card[i].addEventListener('click', function () {
                            document.querySelector('.full').style.display = 'block';
                            document.querySelector('#card-img').style.display = 'block';
                            // document.querySelector('.addcreate').setAttribute('Create Product','dd');
                            let product_id = this.getAttribute('product_id')
                            $('.addcreate').val('Uptade Product');
                            $('#form-add-product').attr('product_id', product_id);
                            document.querySelector('.exit').addEventListener('click', function () {
                                document.querySelector('.full').style.display = 'none';
                            })


                            var card_body_parent = this.closest('.card');
                            var card_img = card_body_parent.getElementsByClassName("shekil")[0];
                            var card_img_src = card_img.getAttribute('src');
                            var card_name = card_body_parent.getElementsByClassName("cardname")[0].innerHTML;
                            var card_lb = card_body_parent.getElementsByClassName("cardlb")[0].innerHTML;
                            var card_description = card_body_parent.getElementsByClassName("carddescription")[0].innerHTML;
                            var card_amount = card_body_parent.getElementsByClassName("cardamount")[0].innerHTML;
                            var card_discount_price = card_body_parent.getElementsByClassName("carddiscountprice")[0].innerHTML;
                            var card_price = card_body_parent.getElementsByClassName("cardmoney")[0].innerHTML;
                            card_price = parseInt(card_price.replace('$', ''));
                            var card_category = card_body_parent.getElementsByClassName("cardcategory")[0].innerHTML;


                            document.getElementById('card-img').innerHTML = `<img style="width:90px;height:90px;display:flex;margin:8px 0px;border:1px solid rgb(234, 234, 234);" src="${card_img_src}">`;
                            document.getElementById('unit-input').value = card_lb;
                            document.getElementById('name-input').value = card_name;
                            document.getElementById('textarea-input').value = card_description;
                            document.getElementById('amount-by-unit').value = card_amount;
                            document.getElementById('discount-price').value = card_discount_price;
                            document.getElementById('price-input').value = card_price;
                            document.getElementById('category-input').value = card_category;
                        });
                    };
                }

                $('.logout').click(function () {
                    localStorage.removeItem('token');
                    window.location = 'pickbazar3.html';
                })

            },
            error: function (error_response) {
                if (error_response.status == 401) {
                    localStorage.removeItem('token');
                    window.location = 'pickbazar3.html';
                }
                alert('Sehvlik bas verdi');
            }
        })
    }
    else {
        window.location = 'pickbazar3.html';
    }

    document.querySelector('body').addEventListener('click', function (event) {

        if (event.target.id === 'loqo') {
            document.querySelector('.settings').classList.toggle('show');
        } else {
            document.querySelector('.settings').classList.remove('show');
        }
    })

    document.querySelector('body').addEventListener('click', function (event) {

        if (event.target.id === 'notice') {
            document.querySelector('.notificationtable').classList.toggle('show');
        } else {
            document.querySelector('.notificationtable').classList.remove('show');
        }
    })
    document.querySelector('.buttonaddproducts').addEventListener('click', function () {
        document.querySelector('.full').style.display = 'block';
    })
    document.querySelector('.exit').addEventListener('click', function () {
        document.querySelector('.full').style.display = 'none';
        document.getElementById("form-add-product").reset();
        document.querySelector('#card-img').style.display = 'none';
        $('.addcreate').val('Create Product');
        // $('.addcreate').removeClass('Uptade');


    })


    // document.querySelector('.buttonaddproducts').addEventListener('click', function () {
    //     document.querySelector('.full').classList.toggle('show3');
    // })



    document.querySelector('body').addEventListener('click', function (event) {

        if (event.target.id === 'hamburger') {
            document.querySelector('.full2').classList.toggle('show');
        } else {
            document.querySelector('.full2').classList.remove('show');
        }
    })


});










