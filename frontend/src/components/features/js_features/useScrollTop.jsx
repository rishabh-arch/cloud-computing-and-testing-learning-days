

export default function useScrollToTop(){
    const body = document.querySelector('#root');
    body.scrollIntoView({
        behavior: 'smooth'
    }, 500)
};