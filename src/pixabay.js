const apiKey = '31315940-fbb1061bb3bfe12c6324aab94';
export default function makeURL(name, page){
    return `https://pixabay.com/api/?key=${apiKey}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
}