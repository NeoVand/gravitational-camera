% gcbook.cls: the design of The Gravitational Camera as a printed book.
%
% A one-column book with a wide outer margin (after Tufte and Thorne and Blandford): footnotes become numbered
% side notes, references to the paper and to other sections sit in the margin beside their paragraph, and figures
% that need it reach into the margin. Written by book/build.mjs, which turns the tutorial's Markdown into the
% LaTeX this class expects; read with LuaLaTeX.
%
% Options:
%   colour=two   the matter and field symbols in the site's two day colours, everything else black (default)
%   colour=full  all five colour roles, as on the site
%   colour=none  every symbol black
%   font=lm      Latin Modern and Latin Modern Math, the paper's family (default)
%   font=garamond | libertinus | stix   EB Garamond, Libertinus or STIX Two, each with its own maths
\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{gcbook}[2026/11/25 The Gravitational Camera: book design]

\def\gc@colour{two}
\def\gc@font{lm}
\DeclareKeys[gcbook]{
  colour.store = \gc@colour,
  font.store = \gc@font,
}
\ProcessKeyOptions[gcbook]

\LoadClass[10pt,twoside,openright]{book}

% ---- page -----------------------------------------------------------------------------------------------------------
% 189 x 246 mm (crown quarto). A text block of 108 mm (about 66 characters) and a margin column of 46 mm.
\RequirePackage[
  paperwidth=189mm, paperheight=246mm,
  inner=18mm, textwidth=108mm, marginparsep=6mm, marginparwidth=46mm,
  top=22mm, headheight=12pt, headsep=8mm, textheight=196mm, footskip=10mm,
]{geometry}
\newlength\gc@fullwidth
\setlength\gc@fullwidth{\dimexpr\textwidth+\marginparsep+\marginparwidth\relax}

% ---- fonts and mathematics ------------------------------------------------------------------------------------------
\RequirePackage{amsmath}
\RequirePackage{fontspec}
\RequirePackage[warnings-off={mathtools-colon,mathtools-overbracket}]{unicode-math}
\unimathsetup{math-style=TeX, bold-style=TeX, mathrm=sym}
% glyphs the text font lacks (arrows, superscript minus, rare Greek) come from STIX Two, then from its maths font
\directlua{luaotfload.add_fallback("gcfallback", {
  "file:STIXTwoText-Regular.otf:mode=node;",
  "file:STIXTwoMath-Regular.otf:mode=node;",
  "file:DejaVuSans.ttf:mode=node;",
})}
\def\gc@fb{RawFeature={fallback=gcfallback}}
\ifdefstring{\gc@font}{garamond}{%
  \setmainfont{EB Garamond}[Renderer=Node, Numbers=Lining, \gc@fb]
  \setmathfont{Garamond-Math.otf}[StylisticSet={1,2,3,4,5,6,7,8,9}]
}{\ifdefstring{\gc@font}{libertinus}{%
  \setmainfont{Libertinus Serif}[Renderer=Node, \gc@fb]
  \setmathfont{Libertinus Math}
}{\ifdefstring{\gc@font}{stix}{%
  \setmainfont{STIX Two Text}[Renderer=Node, \gc@fb]
  \setmathfont{STIX Two Math}
}{% lm: the paper's family, in its optical sizes
  \setmainfont{Latin Modern Roman}[Renderer=Node, \gc@fb]
  \setmathfont{Latin Modern Math}
}}}
\setmonofont{Latin Modern Mono}[Scale=0.95]
\RequirePackage[british]{babel}
\RequirePackage[protrusion=true, expansion=true, tracking=true, final]{microtype}

% the paper's notation (paper/macros.tex) and the tutorial's (tutorial/macros.tex)
\providecommand{\tE}{\mathcal{E}}
\providecommand{\tB}{\mathcal{B}}
\providecommand{\TT}{\mathrm{TT}}
\providecommand{\dd}{\mathrm{d}}
\providecommand{\kB}{k_B}
\providecommand{\SNR}{\mathrm{SNR}}
\newcommand{\vect}[1]{\symbfit{#1}}
\renewcommand{\boldsymbol}[1]{\symbfit{#1}}
\providecommand{\unit}[1]{\,\mathrm{#1}}
\AtBeginDocument{\renewcommand{\Box}{\mdlgwhtsquare}}
% \sym{key}{symbol}: on the site the symbol opens its card; in print it is the symbol
\newcommand{\sym}[2]{#2}

% ---- colour roles ---------------------------------------------------------------------------------------------------
\RequirePackage{xcolor}
% the site's day colours (app/src/app.css, light theme)
\definecolor{gc-matter}{HTML}{533F03}
\definecolor{gc-field}{HTML}{0B5A59}
\definecolor{gc-curv}{HTML}{4D1C7B}
\definecolor{gc-obs}{HTML}{9B2D7F}
\definecolor{gc-light}{HTML}{256B00}
\definecolor{gc-dim}{gray}{0.42}
\definecolor{gc-rule}{gray}{0.62}
% \mathcolor keeps the spacing of the coloured atom; older kernels fall back to a group
\ifdefined\mathcolor
  \newcommand\gc@paint[2]{\mathcolor{#1}{#2}}
\else
  \newcommand\gc@paint[2]{{\color{#1}#2}}
\fi
\newcommand\gc@plain[1]{#1}
\ifdefstring{\gc@colour}{none}{%
  \let\matter\gc@plain \let\field\gc@plain
  \let\curv\gc@plain \let\obs\gc@plain \let\light\gc@plain
}{\ifdefstring{\gc@colour}{full}{%
  \newcommand\matter[1]{\gc@paint{gc-matter}{#1}}
  \newcommand\field[1]{\gc@paint{gc-field}{#1}}
  \newcommand\curv[1]{\gc@paint{gc-curv}{#1}}
  \newcommand\obs[1]{\gc@paint{gc-obs}{#1}}
  \newcommand\light[1]{\gc@paint{gc-light}{#1}}
}{% two: matter and field only
  \newcommand\matter[1]{\gc@paint{gc-matter}{#1}}
  \newcommand\field[1]{\gc@paint{gc-field}{#1}}
  \let\curv\gc@plain \let\obs\gc@plain \let\light\gc@plain
}}

% The site's reader expands the macros above to \htmlClass{q-matter}{…} and \htmlClass{symbol-key}{…} (as
% tutorial/macros.tex defines them for KaTeX); here a role class is its colour and a symbol class nothing.
\newcommand\htmlClass[2]{\ifcsname gc@cls@#1\endcsname\csname gc@cls@#1\endcsname{#2}\else #2\fi}
\expandafter\def\csname gc@cls@q-matter\endcsname{\matter}
\expandafter\def\csname gc@cls@q-field\endcsname{\field}
\expandafter\def\csname gc@cls@q-curv\endcsname{\curv}
\expandafter\def\csname gc@cls@q-obs\endcsname{\obs}
\expandafter\def\csname gc@cls@q-light\endcsname{\light}

% ---- what pandoc's LaTeX writer expects --------------------------------------------------------------------------
\RequirePackage{graphicx}
\RequirePackage{longtable,booktabs,array,calc}
\newcounter{none}
\providecommand{\tightlist}{\setlength{\itemsep}{0pt}\setlength{\parskip}{0pt}}
\RequirePackage{etoolbox}
\RequirePackage{ragged2e}
\RequirePackage{xurl}
\RequirePackage[strict]{changepage}
\RequirePackage{enumitem}
\setlist{itemsep=1pt, parsep=0pt, topsep=4pt plus 2pt}
\setlist[itemize]{label=\textendash, leftmargin=1.4em}

% ---- headings ---------------------------------------------------------------------------------------------------------
\RequirePackage{titlesec}
\RequirePackage{titletoc}
\setcounter{secnumdepth}{2}
\setcounter{tocdepth}{1}

% A chapter opens on a right-hand page: its number large and grey, its title, a hairline into the margin.
\newcommand\gc@chapterlabel{}
\titleformat{\chapter}[display]
  {\normalfont\raggedright}
  {\fontsize{54}{54}\selectfont\color{gc-dim}\thechapter}
  {5mm}
  {\fontsize{23}{28}\selectfont}
  [{\vspace{4mm}\makebox[\linewidth][l]{\color{gc-rule}\rule{\gc@fullwidth}{0.4pt}}}]
\titleformat{name=\chapter,numberless}[display]
  {\normalfont\raggedright}
  {}
  {0mm}
  {\gc@chapterlabel\fontsize{23}{28}\selectfont}
  [{\vspace{4mm}\makebox[\linewidth][l]{\color{gc-rule}\rule{\gc@fullwidth}{0.4pt}}}]
\titlespacing*{\chapter}{0pt}{16mm}{12mm}

\titleformat{\section}
  {\normalfont\fontsize{15}{19}\selectfont\raggedright}
  {\thesection}{0.75em}{}
\titlespacing*{\section}{0pt}{8ex plus 2ex minus 1ex}{2.6ex plus .4ex}
\titleformat{\subsection}
  {\normalfont\large\itshape\raggedright}
  {\upshape\thesubsection}{0.7em}{}
\titlespacing*{\subsection}{0pt}{4.2ex plus 1ex minus .5ex}{1.6ex plus .3ex}
\titleformat{\subsubsection}
  {\normalfont\normalsize\bfseries\raggedright}
  {}{0pt}{}
\titlespacing*{\subsubsection}{0pt}{3ex plus 1ex minus .5ex}{1ex plus .2ex}
\titleformat{\paragraph}[runin]
  {\normalfont\normalsize\itshape}{}{0pt}{}[.]
\titlespacing*{\paragraph}{0pt}{1.5ex plus .5ex}{0.6em}

% the contents
\contentsmargin{2.4em}
\titlecontents{part}[0pt]
  {\addvspace{4.5ex}\normalfont\large}
  {\makebox[2.4em][l]{\thecontentslabel}}{}
  {\hfill\contentspage}[\addvspace{1ex}]
\titlecontents{chapter}[2.4em]
  {\addvspace{1.6ex}\normalfont\normalsize}
  {\contentslabel{2.4em}}{\hspace*{-2.4em}}
  {\hfill\contentspage}
\titlecontents{section}[5.0em]
  {\normalfont\small\color{black!80}}
  {\contentslabel{2.6em}}{}
  {\titlerule*[0.7pc]{.}\contentspage}
% the chapters of a part, on its title page
\titlecontents{pchapter}[2.4em]
  {\addvspace{1.1ex}\normalfont\normalsize}
  {\contentslabel{2.4em}}{}
  {\hfill\contentspage}

% \bookpart{I}{title}: a right-hand page with the part's number, its title and its chapters
\renewcommand\thepart{\Roman{part}}
\newcommand\bookpart[2]{%
  \cleardoublepage
  \thispagestyle{empty}%
  \refstepcounter{part}%
  \phantomsection
  \addcontentsline{toc}{part}{\protect\numberline{\thepart}#2}%
  \markboth{}{}%
  \vspace*{38mm}%
  \begin{adjustwidth*}{0pt}{-\dimexpr\marginparsep+\marginparwidth\relax}%
  {\centering
   {\fontsize{11}{13}\selectfont\scshape\textls[160]{part}\par}%
   \vspace{3mm}%
   {\fontsize{48}{48}\selectfont\color{gc-dim}\thepart\par}%
   \vspace{9mm}%
   {\fontsize{24}{30}\selectfont #2\par}%
  }%
  \vspace{22mm}%
  \startcontents[parts]%
  \begin{adjustwidth}{30mm}{30mm}%
  \printcontents[parts]{p}{0}{\setcounter{tocdepth}{0}}%
  \end{adjustwidth}%
  \end{adjustwidth*}%
  \cleardoublepage}
\newcommand\bookendparts{\stopcontents[parts]}

% \bookchapter{title}{label}{running head}
\newcommand\gc@chaptermark{}
\newcommand\bookchapter[3]{%
  \chapter[#1]{#1}\label{#2}%
  \markboth{\thechapter\quad #3}{\thechapter\quad #3}%
  \setcounter{sidenote}{0}}
% the Prologue: an unnumbered chapter whose sections are 0.1, 0.2, ...
\newcommand\bookprologue[3]{%
  \renewcommand\gc@chapterlabel{{\fontsize{30}{34}\selectfont\color{gc-dim}Prologue\par}\vspace{5mm}}%
  \chapter*{#1}\label{#2}%
  \renewcommand\gc@chapterlabel{}%
  \addcontentsline{toc}{chapter}{\protect\numberline{}Prologue: #1}%
  \markboth{Prologue}{Prologue}%
  \setcounter{chapter}{0}\setcounter{section}{0}\setcounter{equation}{0}%
  \setcounter{figure}{0}\setcounter{table}{0}\setcounter{exercise}{0}}
% the appendices: lettered chapters, one file each; \bookappendix{title}{label}{running head}{plain title}
\newcommand\bookappendices{%
  \appendix
  \cleardoublepage\phantomsection
  \addcontentsline{toc}{part}{\protect\numberline{}Appendices}}
\newcommand\bookappendix[4]{%
  \chapter[\texorpdfstring{#1}{#4}]{#1}\label{#2}%
  \markboth{Appendix \thechapter\quad #3}{Appendix \thechapter\quad #3}%
  \setcounter{sidenote}{0}}
% an unnumbered chapter of the front or back matter
\newcommand\bookunnumbered[3]{%
  \chapter*{#1}\label{#2}%
  \addcontentsline{toc}{chapter}{\protect\numberline{}#1}%
  \markboth{#3}{#3}}

% \booksection{title}{running head}{label}{title as plain text}
\newcommand\booksection[4]{%
  \section[\texorpdfstring{#1}{#4}]{#1}\label{#3}%
  \markright{\thesection\quad #2}%
  \setcounter{sidenote}{0}}
% in the front matter, a section file's ## headings stand unnumbered
\newcommand\gc@unnumberedheadings{\setcounter{secnumdepth}{-1}}
\newcommand\gc@numberedheadings{\setcounter{secnumdepth}{2}}

% ---- running heads ----------------------------------------------------------------------------------------------------
\RequirePackage{fancyhdr}
% running heads in lower-case small capitals; the contents, bibliography and index set their marks without upper case
\newcommand\gc@head[1]{{\footnotesize\scshape\textls[40]{\MakeLowercase{#1}}}}
\newcommand\gc@nocaps[1]{\begingroup\let\MakeUppercase\@firstofone#1\endgroup}
\AtBeginDocument{%
  \let\gc@toc\tableofcontents \renewcommand\tableofcontents{\gc@nocaps\gc@toc}%
  \let\gc@index\printindex \renewcommand\printindex{\gc@nocaps\gc@index}}
\newcommand\gc@folio{{\footnotesize\thepage}}
\fancypagestyle{gc}{%
  \fancyhf{}%
  \fancyhfoffset[LE,RO]{\dimexpr\marginparsep+\marginparwidth\relax}%
  \fancyhead[LE]{\gc@folio\hspace{1.6em}\gc@head{\leftmark}}%
  \fancyhead[RO]{\gc@head{\rightmark}\hspace{1.6em}\gc@folio}%
  \renewcommand{\headrulewidth}{0pt}}
\fancypagestyle{plain}{%
  \fancyhf{}%
  \fancyhfoffset[LE,RO]{\dimexpr\marginparsep+\marginparwidth\relax}%
  \fancyfoot[LE,RO]{\gc@folio}%
  \renewcommand{\headrulewidth}{0pt}}
\pagestyle{gc}
\renewcommand\chaptermark[1]{}
\renewcommand\sectionmark[1]{}
% a blank left-hand page before a chapter carries nothing
\def\cleardoublepage{\clearpage\if@twoside\ifodd\c@page\else
  \hbox{}\thispagestyle{empty}\newpage\if@twocolumn\hbox{}\newpage\fi\fi\fi}

% ---- text -------------------------------------------------------------------------------------------------------------
\setlength\parindent{1.1em}
\linespread{1.04}
\widowpenalty=4000
\clubpenalty=4000
\displaywidowpenalty=2000
\setlength\emergencystretch{2.5em}
\numberwithin{equation}{chapter}
\numberwithin{figure}{chapter}
\numberwithin{table}{chapter}
\setlength\abovedisplayskip{7pt plus 2pt minus 3pt}
\setlength\belowdisplayskip{7pt plus 2pt minus 3pt}
\allowdisplaybreaks[1]

% ---- the margin -------------------------------------------------------------------------------------------------------
% Side notes are numbered within each section; marginfix moves a note down, or onto the next page, rather than
% letting it run into the one above.
\RequirePackage{marginfix}
\newcounter{sidenote}
\renewcommand\thesidenote{\arabic{sidenote}}
\newcommand\gc@notefont{\footnotesize\linespread{1.0}\selectfont\RaggedRight\setlength\parindent{0pt}%
  \setlength\parskip{2pt}}
\newcommand\gc@notemark[1]{\textsuperscript{\normalfont #1}}
\newcommand\sidenote[1]{%
  \refstepcounter{sidenote}%
  \ifmmode\text{\gc@notemark{\thesidenote}}\else\gc@notemark{\thesidenote}\fi
  \marginpar{\gc@notefont\makebox[0pt][r]{\gc@notemark{\thesidenote}\hspace{2pt}}\ignorespaces#1}}
% pandoc writes footnotes: they are side notes here
\AtBeginDocument{\let\footnote\sidenote}
% an unnumbered note beside the paragraph: the paper's places, cross-references, addresses
\newcommand\gcmargin[1]{\marginpar{\gc@notefont #1}}
\newcommand\gcpaper[1]{{\scshape paper}\enspace #1}
\newcommand\gcxref[2]{#1\enspace$\to$\,\ref{#2}, p.\,\pageref{#2}}
\newcommand\gcurl[1]{{\scriptsize\url{#1}}}
\newcommand\gctry{\textit{An interactive version is on the book's website.}}
\newcommand\gcquestion[1]{\textit{#1}}
% the paper's equation numbers, where one of its equations is shown
\newcommand\papertag[1]{\text{\footnotesize\scshape paper\,(#1)}}

% ---- figures ----------------------------------------------------------------------------------------------------------
\RequirePackage[font=small, labelfont=sc, labelsep=period, justification=RaggedRight,
  singlelinecheck=false, skip=5pt, position=below]{caption}
\renewcommand\topfraction{0.85}
\renewcommand\bottomfraction{0.6}
\renewcommand\textfraction{0.12}
\renewcommand\floatpagefraction{0.75}
\setcounter{topnumber}{3}
\setcounter{totalnumber}{4}
\setlength\textfloatsep{14pt plus 4pt minus 4pt}
\setlength\floatsep{12pt plus 4pt minus 2pt}
\newsavebox\gc@figbox
% \gcgraphic{file}: the drawing at its own size, shrunk to the line if it is wider and to 60% of the page if taller
\newcommand\gc@figheight{0.6}
\newcommand\gcgraphic[1]{%
  \sbox\gc@figbox{\includegraphics{#1}}%
  \ifdim\wd\gc@figbox>\linewidth
    \sbox\gc@figbox{\includegraphics[width=\linewidth]{#1}}\fi
  \ifdim\ht\gc@figbox>\gc@figheight\textheight
    \sbox\gc@figbox{\includegraphics[height=\gc@figheight\textheight]{#1}}\fi
  \usebox\gc@figbox}
% a table at its natural width; one wider than the line reaches into the margin, and only one wider than that is
% shrunk
\newcommand\gcfittable[1]{%
  \sbox\gc@figbox{#1}%
  \ifdim\wd\gc@figbox>\linewidth
    \begin{adjustwidth*}{0pt}{-\dimexpr\marginparsep+\marginparwidth\relax}%
    \noindent\ifdim\wd\gc@figbox>\linewidth\resizebox{\linewidth}{!}{\usebox\gc@figbox}\else\usebox\gc@figbox\fi
    \end{adjustwidth*}%
  \else\usebox\gc@figbox\fi}
% a figure that spans the text and the margin (the paper's two-column figures)
\newenvironment{gcwide}
  {\begin{adjustwidth*}{0pt}{-\dimexpr\marginparsep+\marginparwidth\relax}}
  {\end{adjustwidth*}}
% the figure that opens a chapter, under its title
\newenvironment{gcopener}
  {\par\vspace*{-2mm}\noindent\begin{minipage}{\linewidth}\centering\captionsetup{type=figure}%
   \renewcommand\gc@figheight{0.38}}
  {\end{minipage}\par\vspace{6mm}}
% the chapter's first drawing, without its caption (it stands with its caption where the text needs it)
\newcommand\gcopenerart[1]{%
  \par\vspace*{-2mm}{\centering\renewcommand\gc@figheight{0.3}\gcgraphic{#1}\par}\vspace{8mm}}

% ---- boxes ------------------------------------------------------------------------------------------------------------
% No frames: a hairline above and below, a small-capital title. They break across pages and hold side notes.
\newcommand\gc@boxrule{\noindent{\color{gc-rule}\rule{\linewidth}{0.4pt}}\par}
\newcommand\gc@boxtitle[2]{%
  \noindent{\small\scshape #1}%
  \if\relax\detokenize{#2}\relax\else{\small\scshape:}\enspace{\small\itshape #2}\fi\par\nobreak
  \vspace{0.25\baselineskip}\nobreak}
\newenvironment{gc@box}[3]
  {\par\addvspace{1.1\baselineskip}\gc@boxrule\nobreak\vspace{0.3\baselineskip}\nobreak
   \gc@boxtitle{#1}{#2}#3\@afterindentfalse\@afterheading}
  {\par\nobreak\vspace{0.35\baselineskip}\gc@boxrule\addvspace{1.1\baselineskip}}
\newenvironment{gcderivation}[1]{\begin{gc@box}{Derivation}{#1}{}}{\end{gc@box}}
\newenvironment{gcexample}[1]{\begin{gc@box}{Worked example}{#1}{}}{\end{gc@box}}
\newenvironment{gcgap}{\begin{gc@box}{What this sketch leaves out}{}{\small}}{\end{gc@box}}
\newenvironment{gchistory}[1]{\begin{gc@box}{A little history}{#1}{\small}}{\end{gc@box}}

% ---- the end of a chapter: further reading and exercises ----------------------------------------------------------
\newcommand\gc@endheading[1]{%
  \section*{#1}\markright{#1}}
\newcommand\furtherreading{\gc@endheading{Further reading}\small}
\newcommand\furtherreadingfor[1]{\par\addvspace{1ex}\noindent{\footnotesize\scshape section \ref{#1}}\par\nobreak}
\newcounter{exercise}[chapter]
\renewcommand\theexercise{\thechapter.\arabic{exercise}}
\newcommand\exercisesheading{\gc@endheading{Exercises}}
% \begin{exercise}{label}{kind}{section label}: the exercise's number (linked to its solution), its kind and section
\newenvironment{exercise}[3]
  {\par\addvspace{1.0\baselineskip}\refstepcounter{exercise}\label{#1}%
   \noindent\hyperref[sol:#1]{\textbf{\theexercise}}\enspace
   {\footnotesize\scshape #2\enspace\S\,\ref{#3}}\enspace\ignorespaces}
  {\par}
\newcommand\solutionsfor[2]{\par\addvspace{2.5ex}\noindent{\normalsize\itshape #1\enspace #2}\par\nobreak\vspace{0.5ex}}
\newenvironment{solution}[1]
  {\par\addvspace{0.8\baselineskip}\phantomsection\label{sol:#1}%
   \noindent\hyperref[#1]{\textbf{\ref{#1}}}\enspace\ignorespaces}
  {\par}

% ---- index and bibliography -------------------------------------------------------------------------------------------
\RequirePackage[noautomatic]{imakeidx}
\makeindex[intoc, columns=2, columnsep=6mm, title=Index]
\indexsetup{level=\chapter*, toclevel=chapter, othercode=\small}
\RequirePackage[backend=biber, style=authoryear-comp, maxcitenames=2, maxbibnames=8, minbibnames=3,
  uniquelist=false, uniquename=false, dashed=false, giveninits=true, doi=false, url=false, isbn=false,
  eprint=true, sorting=nyt]{biblatex}
\renewcommand*{\bibfont}{\small}
\newcommand\gcbibliography{\gc@nocaps{\printbibliography[heading=bibintoc, title=Bibliography]}}

% ---- links ------------------------------------------------------------------------------------------------------------
\RequirePackage[hidelinks, bookmarksnumbered, bookmarksopen, bookmarksopenlevel=0, unicode]{hyperref}
\RequirePackage{bookmark}
\urlstyle{same}

% added: cross-references into the front matter (no number), and the credit of a figure taken from the paper
\newcommand\gcxrefp[2]{#1\enspace$\to$\,p.\,\pageref{#2}}
\newcommand\gcpapercredit[1]{\unskip\enspace{\footnotesize[{\scshape paper}, Fig.~#1]}}

% long identifiers in typewriter (the appendix on checks names its tests) may break after an underscore
\AtBeginDocument{%
  \DeclareRobustCommand\_{\ifmmode\text{\textunderscore}\else\textunderscore\allowbreak\fi}}
