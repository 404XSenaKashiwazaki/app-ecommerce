import React from 'react'

function FormScrape({title, url,genres, body}) {
  return (
    <div>
        <div className="flex py-4 gap-4">
            <div className="flex-initial min-w-[600px]">
            <form action="#" method="post">

                <div className='bg-slate-100 mb-4'>
                <label htmlFor="title">Title</label>
                <input type="text"
                value={title}
                name='title' id='title' className='border-0 w-full' placeholder='Title postingan' />
                </div>

                <div className='bg-slate-100 mb-4'>
                <label htmlFor="url">Url</label>
                <textarea className='w-full border-0' value={url} id="url" cols="10" rows="2"></textarea>
                </div>

                <div className='bg-slate-100 mb-4'>
                <label htmlFor="genres">Genres</label>
                <textarea className='w-full border-0' value={genres} id="genres" cols="10" rows="2"></textarea>
                </div>

                <div className='bg-slate-100 mb-4'>
                <label htmlFor="body">Body</label>
                <textarea className='w-full border-0' value={body} id="body" cols="50" rows="50"></textarea>
                </div>

                </form>
            </div>
            <div className="w-full">
                <button className=" bg-blue-800 p-1 rounded-sm 
                border-0 text-slate-300 
                h-auto text-sm w-auto px-14 py-2
                font-medium text-center hover:bg-blue-900
                hover:text-slate-200 mr-1' ">Update</button>
            </div>
        </div>
    
    </div>
  )
}

export default FormScrape