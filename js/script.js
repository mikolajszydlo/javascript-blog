'use strict';

const optTitleListSelector = '.titles',
  optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optArticleTagsSelector = '.post-tags .list';

function generateTitleLinks(customSelector = ''){
  const titleList = document.querySelector(optTitleListSelector);
   /* remove contents of titleList */
  titleList.innerHTML= '';
  /* find all the articles and save them to variable: articles */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  console.log(customSelector);
  console.log(optArticleSelector + customSelector);
  let html = '';

  for(let article of articles){
    /* get the article id */
    const articleId = article.getAttribute('id');
    /* find the title element and get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    /* create HTML of the link */
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    /* insert link into titleList */
    // titleList.insertAdjacentHTML('beforebegin', linkHTML);
    html = html + linkHTML;
  }
  titleList.innerHTML = html;

  const titleClickHandler = function(event) {
    event.preventDefault();
    const clickedElement = this;

    /* [DONE] remove class 'active' from all article links  */

    const activeLinks = document.querySelectorAll('.titles a.active');
    for(let activeLink of activeLinks){
      activeLink.classList.remove('active');
    }

    /* [DONE] add class 'active' to the clicked link */
    clickedElement.classList.add('active');

    /* [DONE] remove class 'active' from all articles */

    const activeArticles = document.querySelectorAll('.posts .active');
    for(let activeArticle of activeArticles){
      activeArticle.classList.remove('active');
    }

    /* [DONE] get 'href' attribute from the clicked link */

    const articleAttribute = clickedElement.getAttribute('href');

    /* [DONE] find the correct article using the selector (value of 'href' attribute) */

    const targetArticle = document.querySelector(articleAttribute);
    /* add class 'active' to the correct article */

    targetArticle.classList.add('active');
  };

  const links = document.querySelectorAll('.titles a');

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}
generateTitleLinks();

function generateTags(){
  /* [DONE] find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for(let article of articles) {
    /* [DONE] find tags wrapper */
    let tagsWrapper = article.querySelector(optArticleTagsSelector);
    /* [DONE] make html variable with empty string */
    let html = '';
    /* [DONE] get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /* [DONE] split tags into array */
    const articleTagsArray = articleTags.split(' ');
    /* [DONE] START LOOP: for each tag */
    for(let tag of articleTagsArray) {
      /* [DONE] generate HTML of the link */
      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      /* [DONE] add generated code to html variable */
      html = html + linkHTML;
    /* [DONE] END LOOP: for each tag */
    }
    /* [DONE] insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;
  /* [DONE] END LOOP: for every article: */
  }
}

generateTags();

function tagClickHandler(event){
  /* [DONE] prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* [DONE] make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* [DONE] make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  for(let activeTag of activeTags) {
    /* remove class active */
    activeTag.classList.remove('active');
  /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const clickedTags = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for(let clickedTag of clickedTags) {
    /* add class active */
    clickedTag.classList.add('active');
    /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const tags = document.querySelectorAll('a');
  /* START LOOP: for each link */
  for(let tag of tags) {
    /* add tagClickHandler as event listener for that link */
    tag.addEventListener('click', tagClickHandler);
  /* END LOOP: for each link */
  }
}

addClickListenersToTags();
