import { setTimeout } from "timers"
import $ from 'jquery'
import ClipboardJS from "clipboard"
import Sortable from 'sortablejs';
import moment from 'moment'
import daterangepicker from 'daterangepicker'


let exportList = []
let scrollTimer = null
    

setInterval(()=>{
    if($('#disco-log').length <= 0) {
        let logParent = $('.containerCozyBounded-1rKFAn').parent().parent()[0]
    
        let logContaierHTML = `<div id='disco-log'>
        <div class='export-util-container'>
            <button id="btnCopy">COPY</button>
            <button id="btnClear">CLEAR</button>
        </div>
        <div class="flex">    
            <input type="text" name="datetimes" />
        </div>
        <div id="chatlogContainer" class="chatlog"></div>
        </div>`
    
        $(logParent).append(logContaierHTML)
        $('input[name="datetimes"]').daterangepicker({
            timePicker: true,
            startDate: moment().startOf('hour'),
            endDate: moment().startOf('hour').add(32, 'hour'),
            locale: {
              format: 'M/DD hh:mm A'
            }
          });

          $('input[name="datetimes"]').on('apply.daterangepicker', (ev, picker) => {
              console.log(ev)
              console.log(picker.startDate);
              console.log(picker.endDate);

              startScroll(picker.startDate, picker.endDate)
          });
        
        new Sortable(document.getElementById('chatlogContainer'), {
            animation: 150,
            group: 'shared',
            swap: true,
            ghostClass: 'blue-background-class',
            onUpdate: (evt) => {
                let data = exportList[evt.oldIndex]
                exportList.splice(evt.oldIndex, 1)
                exportList.splice(evt.newIndex, 0, data)
                createList()
            },
            onAdd:  (evt) => {
                let data = getInfo(evt.item)
                exportList.splice(evt.newDraggableIndex, 0, data)
                createList()
            }
        });

        new Sortable(document.getElementsByClassName('messages-3amgkR')[0], {
            group: {
                name: 'shared',
                pull: 'clone',
                 put: false // Do not allow items to be put into this list
            },
            animation: 150,
            swap: true,
            ghostClass: 'blue-background-class',
        });
        
        new ClipboardJS('#btnCopy', {
            text: function(trigger) {
                let str = createCopyStr()
                return str
                //return trigger.getAttribute('aria-label');
            }
        });
        
        $('#btnClear').on('click', e => {
            exportList =  []
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
                ${v.content}
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
                <button class="btn-edit">edit</button>
                <button class="btn-remove">×</button>
            <div class="chatlog__author-avatar-container">
                <img class="chatlog__author-avatar" src="${v.img.src}" />
            </div>
            <div class="chatlog__messages">
                <span class="chatlog__author-name">${v.name}</span>
                
                <div class="chatlog-edit-area">
                    <textarea>
                        ${v.content}
                    </textarea>
                    <button data-id="${i}" class="btn-edit-save">保存</button>
                    <button data-id="${i}" class="btn-edit-cancel">キャンセル</button>
                </div>

                <div class="chatlog__content"> 
                        ${v.content}
                </div>
            </div>
            </div>
            `
    })

    $("#disco-log .chatlog").html(node)

    $(".btn-edit").on("click", e => {
        console.log("edit")
        $(e.currentTarget).parent().find('.chatlog-edit-area').css('display', "block")
        $(e.currentTarget).parent().find('.chatlog__content').css('display', "none")
    })

    $(".btn-edit-save").on("click", e => {
        console.log("save")
        $(e.currentTarget).parent().parent().find('.chatlog-edit-area').css('display', "none")
        $(e.currentTarget).parent().parent().find('.chatlog__content').css('display', "block")
        let tartgetIndex = $(e.currentTarget).data().id
        exportList[tartgetIndex].content = $(e.currentTarget).parent().find('textarea').val()
        createList()

    })

    $(".btn-edit-cancel").on("click", e => {
        $(e.currentTarget).parent().parent().find('.chatlog-edit-area').css('display', "none")
        $(e.currentTarget).parent().parent().find('.chatlog__content').css('display', "block")
    })

    $(".btn-remove").on("click", e => {
        console.log("click");
        let tartgetIndex = $(e.currentTarget).parent().data().id
        exportList.splice(tartgetIndex,1)
        createList()
    })
}
function editSave(index) {

}

function startScroll(s,g) {
    scrollTimer = setInterval(() => {
        //console.log($('.messages-3amgkR .containerCozyBounded-1rKFAn .timestampCozy-2hLAPV'));
        
        let time = parseFloat($('.messages-3amgkR .containerCozyBounded-1rKFAn .timestampCozy-2hLAPV')[0].getAttribute('datetime'))
        // console.log(s.format())
        // console.log(moment.utc(time).format())
        // console.log(moment.utc(time).add(9,'hours') < s)
        
        if(document.getElementsByClassName('messages-3amgkR')[0].scrollTop > 0 && moment.utc(time).add(9,'hours') > s) {
            console.log('scrolling...')
            document.getElementsByClassName('messages-3amgkR')[0].scrollTop = 0
        } else {
            console.log('clear!')
            clearInterval(scrollTimer)
            $('.containerCozyBounded-1rKFAn').each((v,k) => {

                    
                    
                    //console.log(parseFloat($(k).find('.timestampCozy-2hLAPV').attr('datetime')));
                    
                    let ctime = parseFloat($(k).find('.timestampCozy-2hLAPV').attr('datetime'))
                    
                    console.log(s.format());
                    console.log(g.format());
                    console.log(moment.utc(ctime).add(9,'hours').format());
                    
                    
                    if(moment.utc(ctime).add(9,'hours').isAfter(s) && moment.utc(ctime).add(9,'hours').isBefore(g)) {
                        let d = getInfo(k)
                        exportList.push(d)
                    }
                    

            })
            createList()
        }
        }, 800)
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
                    console.log(elm2);
                    
                    $(elm2).find('time').remove()

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

                
                console.log(">>>>>>>>4");
                
                let embedImageText = embedImage.length  > 0 ? `
                <div class="chatlog__embed-image-container">
                    <a rel="noopener" target="_blank" class="chatlog__embed-image-link" href="${embedImage[0].href}">
                        <img alt="" class="chatlog__embed-image" src="${$(embedImage).find("img").length > 0 ? $(embedImage).find('img')[0].src:''}">
                     </a>
                 </div>
                
                `:'' 
                console.log(">>>>>>>>5");
                let authorImage = embedAuthor.find("img").length > 0 ? `<img alt="" class="chatlog__embed-author-icon" src="${embedAuthor.find("img")[0].src}" />`:''
                let embedAuthorText = embedAuthor.length  > 0 ?`
                    <div class="chatlog__embed-author">
                                ${authorImage}
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
                console.log(">>>>>>>>6");
                //let thumbnailText = `
                // <div class="chatlog__embed-thumbnail-container">
                //         <a rel="noopener" target="_blank" class="chatlog__embed-thumbnail-link" href="${$(l).find('img')[0].src}">
                //             <img alt="" class="chatlog__embed-thumbnail" src="${$(l).find('img')[0].src ? $(l).find('img')[0].src : ''}">
                //             <span class="fa fa-external-link external-icon anchor-icon"></span>
                //         </a>
                //         </div>
                // `
                console.log(l);
                
                //console.log($(l).find("a[class*='embedImage']")[0]);
                //embedTitle
                console.log(embedImageText);
                let embedTitle = $(l).find("a[class*='embedTitle']").length > 0 ? `
                    <div class="chatlog__embed-title">
                    <a rel="noopener" target="_blank" class="chatlog__embed-title-link" href="${$(l).find("a[class*='embedTitle']")[0].href}">
                        <span class="markdown">${$(l).find("a[class*='embedTitle']")[0].innerText}</span>
                        <span class="fa fa-external-link external-icon anchor-icon"></span>
                    </a>
                </div>
                `:''
                embedText += `
                <div class = "chatlog__embed-content">
                    <div class="chatlog__embed-text">
                        
                        ${embedAuthorText}
                        ${embedTitle}
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


