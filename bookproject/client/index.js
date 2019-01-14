const wantToRead = 'want-to-read';
const read = 'read';
const reading = 'reading'
let userName = "";
let fuserDataList = "";
let fuseCurrentResult = ""
// get user data 
let getUser = () => {
    userName = $("#username").val()
    return fetch('/api/users', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'referrer': userName
            }
        })
        .then(res => {
            if (res['status'] !== 200) {
                res.json()
                    .then(data1 => alert(data1))
            } else {
                res.json()
                    .then(async data => {
                        $('.header').hide()
                        $('.main-section').show()
                        userBooksListCheck(data, wantToRead)
                        userBooksListCheck(data, reading)
                        userBooksListCheck(data, read)
                        bookList()
                    })
            }
        })
}

// add new user
let addUser = () => {
    let user = $("#name").val()
    return fetch('/api/users', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'referrer': user
            }
        })
        .then(res => {
            console.log(res)
            return res.json()
        })
        .then(data => {
            alert(data)
        })
}

// overall book list
let bookList = () => {
    fetch('/api/books/', {
            method: "Get"
        }).then(res =>
            res.json())
        .then(bookListDetails => {
            fuserDataList = bookListDetails;
            for (i in bookListDetails) {
                if (fuseCurrentResult.length !== 0) {
                    $(".book-list-section").append(`<div class="particular-book"><img src=${fuseCurrentResult[i]['imageUrl']}>
                    <div class = "title-button"><h4>${fuseCurrentResult[i]['title']}</h4>
            <button  onclick="addBook('${fuseCurrentResult[i]['isbn']}','${wantToRead}','${userName}')">Want</button>
            <button onclick="addBook('${fuseCurrentResult[i]['isbn']}','${reading}','${userName}')">Reading</button>
            <button onclick="addBook('${fuseCurrentResult[i]['isbn']}','${read}','${userName}')">Read</button>
            </div></div>`)
                } else {
                    $(".book-list-section").append(`<div class="particular-book"><img src=${bookListDetails[i]['imageUrl']}>
                    <div class="title-button"><h4>${bookListDetails[i]['title']}</h4>
            <button  onclick="addBook('${bookListDetails[i]['isbn']}','${wantToRead}','${userName}')">Want</button>
            <button onclick="addBook('${bookListDetails[i]['isbn']}','${reading}','${userName}')">Reading</button>
            <button onclick="addBook('${bookListDetails[i]['isbn']}','${read}','${userName}')">Read</button>
            </div></div>`)
                }
            }
        })
}

// show user books data
let userBooksList = (_isbn, listType) => {
    return fetch('/api/books', {
            method: "GET",
        })
        .then(res => res.json())
        .then(userBooksDetails => {
            for (i in userBooksDetails) {
                if (userBooksDetails[i]['isbn'] === _isbn) {
                    $('.' + listType).append(`<div class="${userBooksDetails[i]['isbn']}"><img src=${userBooksDetails[i]['imageUrl']}>
            <button class="delete-button"  onclick="deleteBook(${userBooksDetails[i]['isbn']},'${listType}')">delete</button>
            </div>`)
                }
            }
        })
}

//this function iterate over want-to-read,read,reading arrays
let userBooksListCheck = (userdata, listType) => {
    for (i in userdata[listType]) {
        userBooksList(userdata[listType][i]['isbn'], listType)
    }
}

// add book to the user list
let addBook = (_isbn, listType) => {

    return fetch(`/api/list/${listType}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "referrer": userName
        },
        body: JSON.stringify({
            "isbn": _isbn
        })
    }).then(res => {
        if (res['status'] !== 201) {
            return res.json()
                .then(userList => alert(userList))
        } else {
            userBooksList(_isbn, listType)
        }
    })
}

//delete book from the user list
let deleteBook = (_isbn, listType) => {
    console.log(userName)
    return fetch(`/api/list/${listType}/${_isbn}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "referrer": userName
            }
        })
        .then(res => res.json())
        .then(() => $("." + listType + " ." + _isbn).remove())
}

let fuserOperation = async () => {

    let options = {
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
            "title",
            "subtitle"
        ]
    };
    await $("#search").keyup(() => {

        let searchValue = ($('#search').val());
        var fuse = new Fuse(fuserDataList, options);
        var fuseResult = fuse.search(searchValue);
        fuseCurrentResult = fuseResult;
        console.log(fuseCurrentResult)
        $('.book-list-section').empty()
        bookList()
    })

}