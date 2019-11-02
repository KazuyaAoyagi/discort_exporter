import { setTimeout } from "timers";
import $ from 'jquery';

let exportList = []

setTimeout(() => {
    let content = document.getElementsByClassName("containerCozyBounded-1rKFAn")

    let div = document.createElement("div")
    div.id = "dico-log"
    div.style.cssText = 'padding-bottom: 200px; z-index:99999; background-color:#ccc; position:relative; overflow:scroll; width:200px;'
    

    let container = content[0].parentNode.parentNode
    
    container.appendChild(div)
    
    let discoLog = document.getElementById("dico-log")

    $(discoLog).addClass("chatlog")
    
    let codeContainer = document.createElement("div")
    codeContainer.id = "dico-log-container"
    codeContainer.style.cssText = 'font-size:10px; color:#ccc; position:fixed; bottom:0; height:200px; width:200px; overflow:scroll;'
    discoLog.appendChild(codeContainer)
    
    let codeContainer2 = document.getElementById("dico-log-container")
    
    Array.prototype.forEach.call(content, (item, k) => {
        Array.prototype.forEach.call(item.children, (n, i) => {
            if(n.children.length > 0) {
                //名前取得
                if(n.children[0].children.length > 1) {
                    let h2 = n.children[0].getElementsByTagName("h2")
                    if(h2.length > 0) {
                        var button = document.createElement('button');
                        button.type = "button"
                        button.textContent = 'EXPORT';
                        button.onclick= e => { 
                            let parent = e.currentTarget.parentNode.parentNode.parentNode.parentNode
                            let data = getInfo(parent)
                            console.log(data);
                            exportList.push(data)
                            codeContainer2.innerText = discoLog.innerHTML
                            createList()
                            
                        }

                        h2[0].appendChild(button)

                        //let discoLog = document.getElementById("dico-log")
                        //let name = document.createElement("p")
                        //name.textContent = h2[0].getElementsByTagName("span")[1].innerText
                        //discoLog.append(name)
                        //console.log(h2[0].getElementsByTagName("span")[1].innerText);   
                    }
                }
            }
            
        })
        
    })
    
}, 7000)

function createList() {
    let node = ``
    exportList.forEach((v, i) => {
        node += 
            `<div data-id="${i}" class="chatlog__message-group">
            <button class="btn-remove">×</button>
            <div class="chatlog__author-avatar-container">
                <img class="chatlog__author-avatar" src="${v.img.src}" />
            </div>
            <div class="chatlog__messages">
            <span class="chatlog__author-name">${v.name}</span>
            <div class="chatlog__content"> 
                <p>${v.content}</p>
            </div>
            </div>
            </div>
            `

    })

    $("#dico-log").html(node)

    $(".btn-remove").on("click", e => {
        console.log("click");
        let tartgetIndex = $(e.currentTarget).parent().data().id
        exportList.splice(tartgetIndex,1)
        createList()
    })
}

function getInfo(elm) {
    let data = {
        name:"",
        img:null,
        content:""
    }

    let contetText = ""
    Array.prototype.forEach.call(elm.children, (n, i) => {
        //console.log(n.innerText)
        if(n.getElementsByTagName("h2").length > 0) {
            contetText += n.children[1].innerText
        } else {
            contetText += n.innerText
        }
    })

    data.content = contetText

    if(elm.children.length > 0) {
        if(elm.children[0].children.length > 1) {
            if(elm.children[0].getElementsByTagName("img")[0])
            data.img = elm.children[0].getElementsByTagName("img")[0]
            let h2 = elm.children[0].getElementsByTagName("h2")
            if(h2.length > 0) {
                data.name = h2[0].getElementsByTagName("span")[1].innerText
            }
        }
    }
    return data
}