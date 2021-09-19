'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagsLink: Handlebars.compile(document.querySelector('#template-tags-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tags-cloud').innerHTML),
  authorsList: Handlebars.compile(document.querySelector('#template-author-list').innerHTML),
}

const opts = {
  TitleListSelector: '.titles',
  ArticleSelector: '.post',
  TitleSelector: '.post-title',
  ArticleTagsSelector: '.post-tags .list',
  ArticleAuthorSelector: '.post-author',
  TagsListSelector: '.list.tags',
  CloudClassCount: 5,
  CloudClassPrefix: 'tag-size-',
  AuthorsListSelector: '.list.authors'
};

function generateTitleLinks(customSelector = ''){
  const titleList = document.querySelector(opts.TitleListSelector);
  /* remove contents of titleList */
  titleList.innerHTML= '';
  /* find all the articles and save them to variable: articles */
  const articles = document.querySelectorAll(opts.ArticleSelector + customSelector);

  let html = '';

  for(let article of articles){
    /* get the article id */
    const articleId = article.getAttribute('id');
    /* find the title element and get the title from the title element */
    const articleTitle = article.querySelector(opts.TitleSelector).innerHTML;
    /* create HTML of the link */
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    /* insert link into titleList */
    // titleList.insertAdjacentHTML('beforebegin', linkHTML);
    html = html + linkHTML;
  }
  titleList.innerHTML = html;

  const titleClickHandler = function(event) {
    event.preventDefault();
    const clickedElement = this;

    /* remove class 'active' from all article links  */

    const activeLinks = document.querySelectorAll('.titles a.active');
    for(let activeLink of activeLinks){
      activeLink.classList.remove('active');
    }

    /* add class 'active' to the clicked link */
    clickedElement.classList.add('active');

    /* remove class 'active' from all articles */

    const activeArticles = document.querySelectorAll('.posts .active');
    for(let activeArticle of activeArticles){
      activeArticle.classList.remove('active');
    }

    /* get 'href' attribute from the clicked link */

    const articleAttribute = clickedElement.getAttribute('href');

    /* find the correct article using the selector (value of 'href' attribute) */

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

function calculateTagsParams(tags) {
  const valList = [];
  for(let tag in tags){
    valList.push(tags[tag]);
  }
  const tagsParams = {
    'max': Math.max(...valList),
    'min': Math.min(...valList),
  };
  return tagsParams;
}

function calculateTagClass(count, params) {
  const factor = opts.CloudClassCount / (params['max'] - params['min'] + 1);
  const calculatedClass = Math.round(count * factor);

  return opts.CloudClassPrefix  + calculatedClass;
}

function generateTags(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(opts.ArticleSelector);
  /* START LOOP: for every article: */
  for(let article of articles) {
    /* find tags wrapper */
    let tagsWrapper = article.querySelector(opts.ArticleTagsSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    /* START LOOP: for each tag */
    for(let tag of articleTagsArray) {
      /* generate HTML of the link */
      const tagLinkData = {tag: tag,}
      const linkHTML = templates.tagsLink(tagLinkData);
      /* add generated code to html variable */
      html = html + linkHTML;
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags[tag]){
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;
  /* END LOOP: for every article: */
  }
  /* find list of tags in right column */
  const tagList = document.querySelector(opts.TagsListSelector);

  const tagsParams = calculateTagsParams(allTags);

  /* create variable for all links HTML code */
  const allTagsData = {tags: []};

  /* START LOOP: for each tag in allTags: */
  for(let tag in allTags){
    /* generate code of a link and add it to allTagsHTML */
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
    // allTagsHTML += '<a class="' + calculateTagClass(allTags[tag], tagsParams) + '" href="#tag-' + tag + '">' + tag + '</a>';
  }
  /* END LOOP: for each tag in allTags: */

  /*add HTML from allTagsHTML to tagList */
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
}

generateTags();

function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
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
  const tags = document.querySelectorAll('a[href^="#tag-"]');
  /* START LOOP: for each link */
  for(let tag of tags) {
    /* add tagClickHandler as event listener for that link */
    tag.addEventListener('click', tagClickHandler);
  /* END LOOP: for each link */
  }
}

addClickListenersToTags();

function generateAuthors() {
  const allAuthors = {};
  const articles = document.querySelectorAll(opts.ArticleSelector);
  const authorList = document.querySelector(opts.AuthorsListSelector);

  for(let article of articles) {
    let authorWrapper = article.querySelector(opts.ArticleAuthorSelector);

    const articleAuthor = article.getAttribute('data-author');
    const articleAuthorData = {author: articleAuthor,};
    const authorHTML = templates.authorLink(articleAuthorData);

    authorWrapper.innerHTML = authorHTML;

    if(!allAuthors[articleAuthor]){
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }
  }
  const allAuthorsData = {authors: []};

  for(let articleAuthor in allAuthors){
    allAuthorsData.authors.push({
      author: articleAuthor,
      count: allAuthors[articleAuthor],
    })
    // allAuthorsHTML += '<li><a href="#author-' + articleAuthor + '">' + articleAuthor + ' (' + allAuthors[articleAuthor] + ')' + '</a></li>';
  }
  authorList.innerHTML = templates.authorsList(allAuthorsData);
}

generateAuthors();

function authorClickHandler(event){
  event.preventDefault();

  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const author = href.replace('#author-', '');
  const activeAuthors = document.querySelectorAll('a.active[href^="#author-"]');

  for(let activeAuthor of activeAuthors) {
    activeAuthor.classList.remove('active');
  }

  const clickedAuthors = document.querySelectorAll('a[href="' + href + '"]');

  for(let clickedAuthor of clickedAuthors) {
    clickedAuthor.classList.add('active');
  }
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors() {
  const authors = document.querySelectorAll('a[href^="#author-"]');
  for(let author of authors) {
    author.addEventListener('click', authorClickHandler);
  }
}

addClickListenersToAuthors();
