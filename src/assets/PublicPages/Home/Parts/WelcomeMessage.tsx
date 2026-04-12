import { useState, useEffect } from 'react';

/**
 * Fetches the home page intro from the API and displays it.
 */
const Welcome = () =>{
    const [content, setContent]=useState('')

    useEffect(()=>{
        fetch('https://api.wade-usa.com/items/home_page_intro')
        .then(res=>res.json())
        .then(result =>{
            setContent(result.data.intro)
        })
    },[]);

    return(
        <div className='welcome-message'>
            <style>{WELCOME_STYLES}</style>
            <div dangerouslySetInnerHTML={{__html: content}}/>
        </div>
    )
}

export default Welcome

const WELCOME_STYLES = `
    .welcome-message {
        text-align: center;
        margin-top: var(--gap-medium);
        width: 100%;
    }

    .welcome-message table {
        margin: var(--gap-medium) auto;
        border: 1px solid var(--color-accent);
        border-radius: var(--gap-medium);
        border-collapse: separate;
        border-spacing: 0;
        overflow: hidden;
    }

`;