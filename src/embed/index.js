import { setTimeout } from "timers"
import $ from 'jquery'
import ClipboardJS from "clipboard"

let exportList = []

setInterval(()=>{
    if($('#disco-log').length <= 0) {
        let logParent = $('.containerCozyBounded-1rKFAn').parent().parent()[0]
    
        let logContaierHTML = `<div id='disco-log'>
        <div class='export-util-container'>
            <button id="btnCopy">
                Copy
            </button>
            <button id="btnClear">CLEAR</button>
    
        </div>
        <div class="chatlog"></div>
        </div>`
    
        $(logParent).append(logContaierHTML)
        
        new ClipboardJS('#btnCopy', {
            text: function(trigger) {
                let str = createCopyStr()
                return str
                //return trigger.getAttribute('aria-label');
            }
        });
        
        $('#btnClear').on('click', e => {
            exportList = []
            createList()
        })
        createList()
    }
    
    $('.containerCozyBounded-1rKFAn').each((v,k) => {
        
       if($(v).find('.exportBtn').length <= 0) {
        let h2 = k.getElementsByTagName('h2')
        if(k.getElementsByTagName('h2').length > 0) {
            if($(h2).find(".exportBtn").length == 0) {
                let exportHTML = `<button class="exportBtn">EXPORT</button>`
                $(h2).append(exportHTML)
                $('.exportBtn').off()
                $('.exportBtn').on('click', e => {
                    let parent = e.currentTarget.parentNode.parentNode.parentNode.parentNode
                    let data = getInfo(parent)
                    exportList.push(data)
            
                    createList()
                })
            }
        }
       }
        
    })
}, 3000)

function createCopyStr() {
    let node = `<div class="chatlog">`
    exportList.forEach((v, i) => {
        node += 
            `<div class="chatlog__message-group">
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
    node += "</div>"
    return node
}

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

    $("#disco-log .chatlog").html(node)

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
    // $(elm).each((k, v) => {
    //     console.log(v)
    // })
    
    Array.prototype.forEach.call(elm.children, (n, i) => {
            
        //$('div[class*="embed-content"]')
        let contentCozy  = $(n).find('div[class*="contentCozy"]')

        contentCozy.each((i,elm) => {
            
            
            $(elm).children().each((a,b)=> {
                
                if($(b).find("span[class*='reactions']").length > 0) {
                    return
                }

                if($(b).find("div[class*='embedInner']").length > 0) {
                    
                    return
                }

                $(b).find('div[class*="markup"]').each((i,elm2) => {
            
                    if(!elm2.className.match(/embedContentInner/) || elm2.className.match(/embedContentInner/).length <= 0) {
                        contetText += `<p>${$(elm2).text()}</p>`
                    }
                })  

                if($(b).find('img').length > 0) {
                    contetText += `
                   <div class="chatlog__attachment">
                    <img class="chatlog__attachment-thumbnail" src=${$(b).find('img')[0].src} />
                   </div>
                   `
               }    
            
            })
            
            
            $(elm).find('div[class*="embedInner"]').each((c,l) => {
                console.log($(elm));
                
                let embedAuthor = $(elm).find('div[class*="embedAuthor"]')
                let embedImage = $(elm).find('a[class*="embedImage"]')
            
                let embedText = `<div class="chatlog__embed"><div class = "chatlog__embed-content-container"> `

            
                let embedImageText = embedImage.length  > 0 ? `
                <div class="chatlog__embed-image-container">
                    <a rel="noopener" target="_blank" class="chatlog__embed-image-link" href="${embedImage[0].href}">
                        <img alt="" class="chatlog__embed-image" src="${embedImage[0].href}">
                     </a>
                 </div>
                
                `:'' 

                let embedAuthorText = embedAuthor.length  > 0 ?`
                    <div class="chatlog__embed-author">
                                <img alt="" class="chatlog__embed-author-icon" src="${embedAuthor.find("img")[0].src}" />
                                <p>
                                <span class="chatlog__embed-author-name">
                                    <a rel="noopener" target="_blank" class="chatlog__embed-author-name-link" href="${embedAuthor.find("a")[0].href}">
                                        ${embedAuthor.find("a")[0].innerText}
                                        <span class="fa fa-external-link external-icon anchor-icon"></span>
                                    </a>
                                </span>
                            </p>
                        </div>
                `: ''
                
                let thumbnailText = `
                <div class="chatlog__embed-thumbnail-container">
                        <a rel="noopener" target="_blank" class="chatlog__embed-thumbnail-link" href="${$(l).find('img')[0].src}">
                            <img alt="" class="chatlog__embed-thumbnail" src="${$(l).find('img')[0].src}">
                            <span class="fa fa-external-link external-icon anchor-icon"></span>
                        </a>
                        </div>
                `
                embedText += `
                <div class = "chatlog__embed-content">
                    <div class="chatlog__embed-text">
                        
                        ${embedAuthorText}

                        <div class="chatlog__embed-description">
                            ${$(l).find("div[class*='embedDescription']")[0].innerText}
                        </div>
                    </div>
                 </div>

                 ${embedImageText}
                    
                `  
                embedText += `</div></div>`
                contetText += embedText
            })
              
        })
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


