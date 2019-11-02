import { setTimeout } from "timers";
import $ from 'jquery';

let exportList = []

setTimeout(() => {
    let content = document.getElementsByClassName("containerCozyBounded-1rKFAn")
    
    let logParent = $('.containerCozyBounded-1rKFAn').parent().parent()[0]
    
    let logContaierHTML = `<div id='dico-log'>
    <div>
        <button id="btnCopy">COPY</button>
    </div>
    <div class="chatlog"></div>
    </div>`

    $(logParent).append(logContaierHTML)
    
    $('.containerCozyBounded-1rKFAn').each((v,k) => {
        let h2 = k.getElementsByTagName('h2')
        if(k.getElementsByTagName('h2').length > 0) {
            let exportHTML = `<button class="exportBtn">EXPORT</button>`
            $(h2).append(exportHTML)
        }
    })

    $('.exportBtn').on('click', e => {
        let parent = e.currentTarget.parentNode.parentNode.parentNode.parentNode
        let data = getInfo(parent)
        console.log(data);
        exportList.push(data)

        createList()
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

    $("#dico-log .chatlog").html(node)

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