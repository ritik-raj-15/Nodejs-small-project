var Entry = document.getElementById("Entry");
var submit = document.getElementById("submit");
var arr=[
//{data:?,id:?,state:?}
];
var id=0;

// GET method to fetch the data from the data.txt file present in server.
    let request = new XMLHttpRequest();
    request.addEventListener('load',function(){
            let tasks = JSON.parse(request.responseText);
            if(tasks)
            {
                //console.log(tasks);
                arr=tasks;
                if(arr.length==0) id=0;
                else id=arr[arr.length-1].key+1;
                tasks.forEach(ele => {
                    EntryUpdated(ele.data,ele.key,ele.state)
                });
               
            }
    });
    request.open("GET","/todo");
    request.send();


function addEntery(item)
{
    let div = document.createElement("div");
    div.setAttribute("id",id);
    div.setAttribute("class","row Entry-border")
    let p = document.createElement('p');
    p.setAttribute("class","col-8");
    p.innerHTML=item;
    let checkbox = document.createElement('input');
    checkbox.setAttribute("type","checkbox");
    checkbox.setAttribute("id","checkbox");
    checkbox.addEventListener('click',function(){

        if(checkbox.checked==true)
        p.setAttribute("id","strike");
        else
        p.removeAttribute("id","strike");

        //console.log("hello")
        updateState(div.id,checkbox.checked);
    });
    let span = document.createElement('span');
    let close = document.createElement('span');
    close.innerHTML="&times;"
    close.addEventListener('click',function(){
        div.remove();
        updateList(div.id);
       // console.log(div.id);
    });
    span.setAttribute("class","close");
    span.appendChild(checkbox);
    span.appendChild(close);
    div.appendChild(p);
    div.appendChild(span);
    Entry.appendChild(div);
    arr.push({data:item,key:id,state:checkbox.checked});
    id++;
   // print();
}
submit.addEventListener('keydown',(event)=>{
    if(event.key === 'Enter')
    { 
        if(submit.value!='')
            {
                addEntery(submit.value);
                submit.value='';
                Postreq();
            }
        else
            alert("Please Enter The Task");
    }
});
function updateList(id){
    arr.splice(id,1);
    for(let i=0;i<arr.length;i++)
    {
        arr[i].key=i;
    }
    Postreq();
    renderList();
}

function updateState(id,setState)
{
    console.log(id,setState);
    arr[id].state=setState;
    Postreq();
}

function renderList()
{
    if(arr.length==0) id=0;
    Entry.innerHTML="";
    for(let i=0;i<arr.length;i++)
    {
        EntryUpdated(arr[i].data,arr[i].key,arr[i].state);
    }
}

function EntryUpdated(item,id,state)
{
    let div = document.createElement("div");
    div.setAttribute("id",id);
    div.setAttribute("class","row Entry-border")
    let p = document.createElement('p');
    p.setAttribute("class","col-8");
    p.innerHTML=item;
    let checkbox = document.createElement('input');
    checkbox.setAttribute("type","checkbox");
    checkbox.setAttribute("id","checkbox");
    checkbox.addEventListener('click',function(){
        if(checkbox.checked==true)
        p.setAttribute("id","strike");
        else
        p.removeAttribute("id","strike");
        updateState(div.id,checkbox.checked);
    });
    checkbox.checked=state;
        if(checkbox.checked==true)
        p.setAttribute("id","strike");
        else
        p.removeAttribute("id","strike");
    let span = document.createElement('span');
    let close = document.createElement('span');
    close.innerHTML="&times;"
    close.addEventListener('click',function(){
        div.remove();
        updateList(div.id);
    });
    span.setAttribute("class","close");
    span.appendChild(checkbox);
    span.appendChild(close);
    div.appendChild(p);
    div.appendChild(span);
    Entry.appendChild(div);
}
// sending the entered data to server to save it in data.txt file.
function Postreq()
{
    let request = new XMLHttpRequest();
    request.open("POST","/todo");
    request.send(JSON.stringify(arr));
}

