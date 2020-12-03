const next = document.getElementById("next")
const cpf = document.getElementById("cpf")
const cpf_wrapper = document.getElementById("cpf_wrapper")
cpf_wrapper.style.display = "none"
const cpf_warning = document.getElementById("cpf_warning")
const username = document.getElementById("username")
const username_wrapper = document.getElementById("username_wrapper")
username_wrapper.style.display= "none"
const email = document.getElementById("email")
const email_wrapper = document.getElementById("email_wrapper")
email_wrapper.style.display= "none"
const email_warning = document.getElementById("email_warning")
const password = document.getElementById('password')
const password_wrapper = document.getElementById('password_wrapper')
password_wrapper.style.display= "none"
const confirm_password = document.getElementById("confirm_password")
const confirm_password_wrapper = document.getElementById("confirm_password_wrapper")
confirm_password_wrapper.style.display= "none"
const type_profile = document.getElementById("type_profile")
const account_wrapper = document.getElementById('account_wrapper')
account_wrapper.style.display="block"
const button_prestador = document.getElementById('prestador')
const button_contratante = document.getElementById('contratante')
const set_button = document.getElementById('set_button')
const segment_wrapper = document.getElementById('segment_wrapper')
segment_wrapper.style.display= "none"
professions_wrapper = document.getElementById('professions_wrapper')
professions_wrapper.style.display= "none"
category = document.getElementById('categories')
profession = document.getElementById('professions')

cpf.addEventListener('ionChange', (e)=>{
            v = e.target
            if(v.value.length == 14){
                  fetchData = {
                    method: 'POST',
                    body: JSON.stringify({"cpf": v.value}),
                     headers: {
                          'Content-Type': 'application/json'
                        }
                  }
                    fetch("/user_cpf_validate", fetchData)
                    .then(response => response.json())
                    .then(r =>
                     r['cpf'] == true ? [cpf_wrapper.style.display = "none", email_wrapper.style.display= "block"]
                    : cpf_warning.innerText=r['cpf']
                    )

          }})

email.addEventListener('ionChange', (e)=>{
            v = e.target
            if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.value)){
                fetch(`/user_email_validate?email=${v.value}`)
                    .then(response => response.json())
                    .then(r =>
                     r['code'] == true ? [email_wrapper.style.display = "none",
                                            username_wrapper.style.display= "block",
                                            create_button('next_after_name', "[username_wrapper.style.display = 'none', segment_wrapper.style.display= 'block', selectCategories()]") ]
                    : email_warning.innerText=r['email']
                    )

              }
       })

const aux_next = (hide, show) => {
    hide.style.display = "none";
    show.style.display = "block"
}

const next_step =(f)=> {
  next.addEventListener('click', f)
}
//
//const remove_event = (f) => {
//    next.removeEventListener('click', f)
//}


button_prestador.addEventListener('click', ()=>{
    type_profile.value = 1
    button_prestador.setAttribute('color', 'secondary')
    account_wrapper.style.display = 'none'
    cpf_wrapper.style.display = 'block'

})

button_contratante.addEventListener('click', ()=>{
    type_profile.value = 0
    button_contratante.setAttribute('color', 'secondary')
    account_wrapper.style.display = 'none'
    cpf_wrapper.style.display = 'block'
})

const create_button = (id, events) => {

   let build =  `<ion-fab vertical="bottom" horizontal="end" slot="fixed">
                    <ion-fab-button id=${id} onclick="${events}">
                        <ion-icon name="arrow-forward-outline"></ion-icon>
                    </ion-fab-button>
                </ion-fab>`
   set_button.innerHTML = build

}

 const selectCategories = () => {
      const area = document.getElementById('categories')
      fetch(`/segment`)
      .then(response => response.json())
      .then(r => set_categories_option(area, r, true))
//      .then([updateProfessionSelect(),
//             segment_wrapper.style.display='none',
//             document.getElementById('set_button').remove('next_after_name'),
//             addEventListener('ionBlur', ()=>{professions_wrapper.style.display = 'none'}),
//             ])
       .then(updateProfessionSelect())
       .then(professions_wrapper.addEventListener('ionFocus', ()=>{segment_wrapper.style.display='none'}))
       .then(document.getElementById('set_button').innerHTML='')
       .then(professions_wrapper.addEventListener('ionChange', ()=>{professions_wrapper.style.display = 'none',
                                                                    password_wrapper.style.display = 'block',
                                                                    create_button('next_after_profession', "check_passwords()")}))
//        password_wrapper.style.display = 'block'
   }


  const set_categories_option = (id, objectOptions, open) => {
          let objectSelectElement = id;
          let options;
          objectOptions.forEach((option, i) => {

          let selectOption = `<ion-select-option value=${option.id}>
                               <option value=${option.id}>${option.Segmento}</option>
                              </ion-select-option>`
            options += selectOption
          });

          objectSelectElement.innerHTML = options
          //objectSelectElement.value = objectOptions[0];

          if (open==true){
             objectSelectElement.dispatchEvent(new Event('click'));
          }

  }


 const updateProfessionSelect = () => {
      const area = document.getElementById('categories')
      const profession = document.getElementById('professions')

      area.addEventListener('ionChange', (e)=>{
            v = e.target
            fetch(`/profession/${area.value}`)
            .then(response => response.json())
            .then(r => set_professions_option(profession, r, true))
            .then( professions_wrapper.style.display="block")
          })

   }


 const setProfessionSelect = (area) => {
    const profession = document.getElementById('professions')
    fetch(`/profession/${area}`)
    .then(response => response.json())
    .then(r => set_professions_option(profession, r, false))
    console.log(area)

  }


  const set_professions_option = (id, objectOptions, open) => {
          let objectSelectElement = id;
          let options;
          objectOptions.forEach((option, i) => {

          let selectOption = `<ion-select-option value=${option.id}>
                               <option value=${option.id}>${option.profession}</option>
                              </ion-select-option>`
            options += selectOption
          });

          objectSelectElement.innerHTML = options
          //objectSelectElement.value = objectOptions[0];

          if (open==true){
             objectSelectElement.dispatchEvent(new Event('click'));
          }

  }

const check_passwords = () => {

     let password1 = password.value
     if (password1 != null){
             let password2 = confirm_password
             password_wrapper.style.display = "none"
             confirm_password_wrapper.style.display ="block"
             set_button.style.display = "none"
             confirm_password.addEventListener('ionChange', ()=>{

                 if (password2.value == password1){
                     console.log('match')
                     document.getElementById("confirm_password_text").innerText=''
                     confirm_password_wrapper.style.display ="none"

                        fetchData = {
                               method: 'POST',
                               body: JSON.stringify({ "cpf": cpf.value,
                                                     "username":username.value,
                                                      "email":email.value,
                                                      "type_profile":type_profile.value,
                                                      "category":category.value,
                                                      "profession":profession.value,
                                                      "password" : password.value,
                                                      }),
                                headers: {
                                     'Content-Type': 'application/json'
                                   }
                             }
                               fetch("/register", fetchData)
                               .then(response => response.json())
                              .then(r =>{window.location.replace('/plan_user')})

                 }else{
                   console.log('not match')
                   document.getElementById("confirm_password_text").innerText="senha não confere"

                 }

             })
     }
}


