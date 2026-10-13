/**
 * Seed.gs — confirmed starting content, extracted from Victor's own memoir
 * "A Journey of Faith, Passion and Music" (18 pp.) and his notes file.
 *
 *  status = confirmed           → stated in the source
 *  status = needs-confirmation  → implied or approximate; Victor should check
 *  status = placeholder         → empty slot for content Victor will provide
 *                                 (hidden on the public site, shown in ?preview)
 *
 * setupPortfolio() copies this into the Sheet once. After that, THE SHEET IS
 * THE SOURCE OF TRUTH — edit there, not here. The site also falls back to this
 * file if no Sheet is connected, so it renders on day one.
 */
function getSeed_() {
  var T = true;
  return {

    PROFILE: [
      { key: 'full_name', value: 'Victor Unyuthfua Uringtho', status: 'confirmed' },
      { key: 'display_name', value: 'Victor Uringtho', status: 'confirmed' },
      { key: 'name_meaning', value: 'Unyuthfua means “Show us our home” in the Alur language.', status: 'confirmed' },
      { key: 'roles', value: 'Music Producer · Songwriter · Instrumentalist · Arranger · Recording & Mixing Engineer · Live Sound Engineer', status: 'confirmed' },
      { key: 'hero_statement', value: 'A life in music that began with a guitar made from a piece of wood, an old pan and motorcycle clutch wires — and grew into a calling to help others bring their musical dreams to life.', status: 'confirmed', notes: 'Written from the memoir; Victor may reword.' },
      { key: 'positioning', value: 'Ugandan producer, arranger and sound engineer who has spent four decades turning other people’s musical ideas into finished sound — in the studio and on stage.', status: 'confirmed' },
      { key: 'born', value: '31 May 1973 · Kamuli, Uganda', status: 'confirmed' },
      { key: 'heritage', value: 'Alur by heritage, born in Busoga', status: 'confirmed' },
      { key: 'first_chords_year', value: '1986', status: 'confirmed', notes: 'From Victor’s notes file' },
      { key: 'signature_quote', value: 'Music is not merely what I do. It is a lifelong journey, a calling, and a way of serving others through creativity.', status: 'confirmed' },
      { key: 'motivation_quote', value: 'To use my knowledge, skills, and experience to help others realise their musical dreams.', status: 'confirmed' },
      { key: 'lesson_quote', value: 'When you have a passion for something, you find a way to begin, even when you do not have everything you need.', status: 'confirmed' },
      { key: 'hero_image', value: 'asset:portrait', status: 'confirmed', notes: 'Replace with a Drive file ID or URL of a stronger performance/studio photo when available' },
      { key: 'email', value: '[ADD EMAIL]', status: 'placeholder' },
      { key: 'phone', value: '[ADD PHONE / WHATSAPP]', status: 'placeholder' },
      { key: 'base_location', value: '[ADD CITY — e.g. Kampala, Uganda]', status: 'placeholder' },
      { key: 'enquiry_inbox', value: '[ADD EMAIL THAT RECEIVES WEBSITE ENQUIRIES]', status: 'placeholder' },
      { key: 'share_image_url', value: '[ADD PUBLIC IMAGE URL FOR SOCIAL SHARING]', status: 'placeholder' }
    ],

    CHAPTERS: [
      { order: 1, id: 'home', chord: 'C', title: 'Show Us Our Home', period: '1973',
        summary: 'Born in Kamuli to a nurse and a haematologist; an Alur son of Busoga.',
        body: 'I was born on 31 May 1973 in Kamuli, Uganda, to the late Edith Basirika Uringtho and Fred Binego Uringtho. At the time of my birth, my father was in Nigeria pursuing further studies. My mother, a trained nurse, travelled from Kampala to her hometown of Kamuli so that she could receive support from her family during childbirth.\n\nI am an Alur by heritage, born in Busoga. My name, Unyuthfua, means “Show us our home” in the Alur language. I am the firstborn of my parents, and I have two brothers and two sisters.\n\nLittle did I know that the passion that would shape much of my life was already taking root during my childhood.',
        quote: 'My name, Unyuthfua, means “Show us our home.”', image: '', image_caption: '', visible: T, status: 'confirmed' },

      { order: 2, id: 'homemade-guitar', chord: 'G7', title: 'The Boy Who Made His Own Guitar', period: 'Childhood',
        summary: 'A Sunday-school guitarist, no guitar of his own — so he built one.',
        body: 'My musical journey began at a very early age when I attended Sunday school. There was a young man who played the guitar and sang songs, and I was fascinated by what he could do with the instrument. I wanted to play just like him.\n\nThere was only one problem: I did not have a guitar, and my parents could not afford to buy me one at the time. But the desire to make music was stronger than the limitation.\n\nI carved a flat arm from a piece of wood to serve as the neck and attached it to an old pan, which became its sound box. I then used wires from a motorcycle clutch cable as my strings — not comfortable, but it didn’t matter. I would happily play it for anyone willing to listen, including the young man whose playing had inspired me. I later discovered that he was actually my cousin.',
        quote: 'When you have a passion for something, you find a way to begin, even when you do not have everything you need.',
        image: '[ADD PHOTO — or an illustration of the homemade guitar]', image_caption: '', visible: T, status: 'confirmed' },

      { order: 3, id: 'first-chords', chord: 'F', title: 'First Chords in Nairobi', period: '1986',
        summary: 'A cousin, a borrowed guitar and a week of Christmas holidays.',
        body: 'After completing Primary Seven, I joined my family in Nairobi, where my father was working with Aga Khan Hospital. During the Christmas holidays, my cousin Stephen Kasamba visited from Kampala, bringing along a guitar.\n\nStephen taught me my first two chords: C and G7. I spent the entire day practising them. When he returned from town later that day, he taught me a third chord, F. By the following day, I could play all the songs I knew using those three chords. He then introduced me to D, and before long I could play the songs I knew in two keys, C and G.\n\nStephen stayed for only a week. When he left, I was once again without a guitar — and I would wait another two years before I could play one again.',
        quote: 'By the following day, I could play all the songs I knew using those three chords.', image: '', image_caption: '', visible: T, status: 'confirmed' },

      { order: 4, id: 'guitar-of-my-own', chord: 'D', title: 'A Guitar of My Own', period: 'c. 1988',
        summary: 'A nylon-stringed gift from Germany — and the fastest student his teacher had seen.',
        body: 'That opportunity came through Stephen’s younger brother, Peter Kasamba — the very guitarist I had admired during Sunday school. Peter visited us in Nairobi with a nylon-stringed guitar. This time something remarkable happened: the guitar was mine. Stephen, who had travelled to Germany, had bought it for me as a gift.\n\nI was told I was the first student he had taught who learned to play so quickly — two days, to be precise. Peter taught me more chords, including A, Am, B, Bm, E, Em and Dm. When he returned to Kampala, I finally had an instrument of my own.\n\nSchool commitments meant that most of my playing happened during the holidays, but my passion continued to grow.',
        quote: 'Something remarkable happened: the guitar was mine.', image: '', image_caption: '', visible: T, status: 'confirmed' },

      { order: 5, id: 'church-fellowship', chord: 'A', title: 'Growing Through Church and Fellowship', period: '1991 – 1995',
        summary: 'Keyboard, then drums and bass — learning by serving.',
        body: 'My interest in music gradually expanded beyond the guitar. I became interested in the keyboard, and another cousin, Patrick Kasamba, taught me what he knew about playing it. In return, I shared my guitar knowledge with him — a wonderful exchange of skills.\n\nEventually, I began playing guitar and piano during home fellowship meetings and church services. At times, we were the instrumentalists available, and that gave me opportunities to practise, serve and improve.\n\nBetween 1991 and 1993 I kept developing. Through Senior Five and Senior Six, from 1993 to 1995, my skills grew considerably; I learned more guitar and keyboard and went on to explore the drums and bass guitar. I was not simply learning how to play — I was developing an appreciation of rhythm, harmony, arrangement, and the way instruments work together.',
        quote: 'At times, we were the instrumentalists available — and that gave me opportunities to practise, serve and improve.', image: '', image_caption: '', visible: T, status: 'confirmed' },

      { order: 6, id: 'ayf-band', chord: 'Am', title: 'The Anglican Youth Fellowship Band', period: '1995',
        summary: 'A turning point: music as teamwork.',
        body: 'A significant turning point came in 1995 when I joined the Anglican Youth Fellowship band. My cousin Peter Kasamba, my first guitar teacher and an important mentor, was part of the team. It was also during this period that I met Arthur Mutesasira, who would later play an important role in shaping and strengthening my keyboard playing.\n\nThe experience helped me understand that music was more than an individual pursuit. It was also about teamwork, learning from others, sharing ideas, and continually refining one’s craft.\n\nMy curiosity was beginning to extend beyond performing. I wanted to understand how music was put together, how instrumental sounds were created, and how a musical idea could become a finished recording.',
        quote: 'Music was more than an individual pursuit.', image: '[ADD AYF BAND PHOTO]', image_caption: '', visible: T, status: 'confirmed' },

      { order: 7, id: 'wandegeya', chord: 'Em', title: 'Four Tracks in Wandegeya', period: 'c. 2000',
        summary: 'A Roland XP-80, a four-track tape recorder and a first master copy.',
        body: 'My first recording project, as I recall it, took place around the year 2000. It was for a gentleman named Zephaniah Mukalere, who believed I could produce his project. I was still developing my skills and working with limited equipment, but I accepted the challenge.\n\nI worked from a small studio in Wandegeya, Kampala, using a Roland XP-80 to create the soundtracks. I recorded his vocals on a four-track tape recorder, mixed the material to the best of my ability and produced my first master copy.\n\nZephaniah later travelled to the United Kingdom, taking the master with him. He returned with a Korg N264 workstation and an Akai DPS16 — sixteen tracks, eight channels of simultaneous recording. It opened up new possibilities. There was no looking back.',
        quote: 'I had moved from playing music to helping create recorded music from start to finish.', image: '[ADD STUDIO PHOTO]', image_caption: '', visible: T, status: 'confirmed' },

      { order: 8, id: 'thank-you-lord', chord: 'Dm', title: '“Thank You Lord” — and Beyond', period: '2002 – today',
        summary: 'His own album, study in the UK, and a working life in studios and on stages.',
        body: 'In those early days I was not yet widely known as someone who recorded and produced music, and clients were few. Rather than let that discourage me, I invested my time in creating my own music. In 2002, I released my album, Thank You Lord.\n\nSince then, I have recorded and worked on numerous projects for different artists. I have also travelled to the United Kingdom to study rhythm programming, music recording and production [ADD YEAR(S) AND INSTITUTION].\n\nToday I write music, play instruments, arrange compositions, create soundtracks, record, mix and master. I provide live sound mixing and recording, and I mix and master for artists who send me their studio stems from outside Uganda.',
        quote: 'Every project has taught me something, and every new artist has presented a different musical idea, challenge, and opportunity.', image: '', image_caption: '', visible: T, status: 'confirmed' }
    ],

    MILESTONES: [
      { order: 1, year: '1973', date_label: '31 May 1973', title: 'Born in Kamuli', description: 'Firstborn of Edith Basirika and Fred Binego Uringtho. Alur by heritage, born in Busoga.', category: 'Life', visible: T, status: 'confirmed' },
      { order: 2, year: 'Childhood', date_label: 'Childhood', title: 'Builds his first guitar', description: 'Wood neck, an old pan for a sound box, motorcycle clutch-cable strings.', category: 'Music', visible: T, status: 'confirmed' },
      { order: 3, year: '1986', date_label: '1986', title: 'First chords, Nairobi', description: 'Stephen Kasamba teaches C, G7, F and D over a Christmas holiday.', category: 'Music', visible: T, status: 'confirmed' },
      { order: 4, year: '1988', date_label: 'c. 1988', title: 'A guitar of his own', description: 'A nylon-stringed guitar, bought in Germany by Stephen, delivered by Peter Kasamba.', category: 'Music', visible: T, status: 'needs-confirmation' },
      { order: 5, year: '1991', date_label: '1991 – 1995', title: 'Keyboard, drums, bass', description: 'Plays guitar and piano at fellowship meetings and church services; expands to drums and bass.', category: 'Music', visible: T, status: 'confirmed' },
      { order: 6, year: '1995', date_label: '1995', title: 'Joins the Anglican Youth Fellowship band', description: 'Plays alongside Peter Kasamba; meets Arthur Mutesasira.', category: 'Band', visible: T, status: 'confirmed' },
      { order: 7, year: '2000', date_label: 'c. 2000', title: 'First production & master copy', description: 'Produces Zephaniah Mukalere’s project in Wandegeya, Kampala.', category: 'Production', visible: T, status: 'confirmed' },
      { order: 8, year: '2002', date_label: '2002', title: 'Releases “Thank You Lord”', description: 'His own album.', category: 'Release', visible: T, status: 'confirmed' },
      { order: 9, year: '[ADD YEAR]', date_label: '[ADD YEAR]', title: 'Studies in the United Kingdom', description: 'Rhythm programming, music recording and production.', category: 'Learning', visible: T, status: 'needs-confirmation' },
      { order: 10, year: '[ADD YEAR]', date_label: '[ADD YEARS]', title: 'Blankets & Wine and Roast & Rhyme', description: 'Sound services at three Blankets & Wine events and two Roast & Rhyme events.', category: 'Live sound', visible: T, status: 'confirmed' },
      { order: 11, year: 'Today', date_label: 'Today', title: 'International mixing & mastering', description: 'Mixes and masters for artists who send studio stems from outside Uganda.', category: 'Production', visible: T, status: 'confirmed' }
    ],

    MUSIC: [
      { order: 1, id: 'thank-you-lord', type: 'Album', title: 'Thank You Lord', artist: 'Victor Uringtho', year: 2002, roles: 'Artist, Songwriter [CONFIRM ROLES]',
        description: 'Victor’s own album — made when clients were few and he chose to invest in his own music.', cover_image: '[ADD ALBUM ARTWORK]',
        spotify_url: '[ADD SPOTIFY LINK]', youtube_url: '', audio_url: '', related_artist: '', related_band: '', related_chapter: 'thank-you-lord', featured: T, visible: T, status: 'confirmed' },
      { order: 2, id: 'zephaniah-first', type: 'Project', title: '[ADD PROJECT TITLE]', artist: 'Zephaniah Mukalere', year: 'c. 2000', roles: 'Produced, Soundtracks, Recorded, Mixed',
        description: 'Victor’s first production: soundtracks on a Roland XP-80, vocals on a four-track tape recorder, mixed to a first master copy.', cover_image: '',
        spotify_url: '', youtube_url: '', audio_url: '', related_artist: 'Zephaniah Mukalere', related_band: '', related_chapter: 'wandegeya', featured: T, visible: T, status: 'confirmed' },
      { order: 3, id: 'victor-track', type: 'Track', title: '[ADD TRACK TITLE]', artist: '[ADD ARTIST]', year: '[ADD YEAR]', roles: '[ADD VICTOR’S ROLE]',
        description: 'Audio file supplied with the project (victor_track.mp3). Upload to Drive or SoundCloud and paste the link in audio_url.', cover_image: '',
        spotify_url: '', youtube_url: '', audio_url: '[ADD DRIVE FILE LINK]', related_artist: '', related_band: '', related_chapter: '', featured: T, visible: T, status: 'placeholder' },
      { order: 4, id: 'produced-1', type: 'Single', title: '[ADD SONG TITLE]', artist: '[ADD ARTIST NAME]', year: '[ADD YEAR]', roles: '[ADD PRODUCTION CREDIT]',
        description: '', cover_image: '[ADD ARTWORK]', spotify_url: '[ADD SPOTIFY LINK]', youtube_url: '', audio_url: '', related_artist: '', related_band: '', related_chapter: '', featured: false, visible: T, status: 'placeholder' }
    ],

    ARTISTS: [
      { order: 1, name: 'Isaiah Katumwa', category: 'Artists & Groups', roles: '[CONFIRM ROLE]', project: '[ADD PROJECT]', year: '[ADD YEAR]', image: '', spotify_url: '', story: '', visible: T, status: 'confirmed' },
      { order: 2, name: 'Judith Babirye', category: 'Artists & Groups', roles: '[CONFIRM ROLE]', project: '[ADD PROJECT]', year: '[ADD YEAR]', image: '', spotify_url: '', story: '', visible: T, status: 'confirmed' },
      { order: 3, name: 'Michael Kitanda', category: 'Artists & Groups', roles: '[CONFIRM ROLE]', project: '[ADD PROJECT]', year: '[ADD YEAR]', image: '', spotify_url: '', story: '', visible: T, status: 'confirmed' },
      { order: 4, name: 'The Heralds', category: 'Artists & Groups', roles: '[CONFIRM ROLE]', project: '[ADD PROJECT]', year: '[ADD YEAR]', image: '', spotify_url: '', story: '', visible: T, status: 'confirmed' },
      { order: 5, name: 'God’s Image', category: 'Artists & Groups', roles: '[CONFIRM ROLE]', project: '[ADD PROJECT]', year: '[ADD YEAR]', image: '', spotify_url: '', story: '', visible: T, status: 'confirmed' },
      { order: 6, name: 'Dove 7', category: 'Artists & Groups', roles: '[CONFIRM ROLE]', project: '[ADD PROJECT]', year: '[ADD YEAR]', image: '', spotify_url: '', story: '', visible: T, status: 'confirmed' },
      { order: 7, name: 'Zephaniah Mukalere', category: 'Produced', roles: 'Producer, Soundtracks, Recording, Mixing', project: 'First production project', year: 'c. 2000', image: '', spotify_url: '', story: 'The first artist to trust Victor with a full production.', visible: T, status: 'confirmed' },
      { order: 8, name: 'Qwela Band', category: 'Live Sound', roles: 'Live sound', project: '', year: '[ADD YEAR]', image: '', spotify_url: '', story: '', visible: T, status: 'confirmed' },
      { order: 9, name: 'Zauka', category: 'Live Sound', roles: 'Live sound', project: '', year: '[ADD YEAR]', image: '', spotify_url: '', story: '', visible: T, status: 'confirmed' },
      { order: 10, name: 'Soul Beat', category: 'Live Sound', roles: 'Live sound', project: '', year: '[ADD YEAR]', image: '', spotify_url: '', story: '', visible: T, status: 'confirmed' },
      { order: 11, name: 'Code 9', category: 'Live Sound', roles: 'Live sound', project: '', year: '[ADD YEAR]', image: '', spotify_url: '', story: '', visible: T, status: 'confirmed' },
      { order: 12, name: 'Choirs & solo artists', category: 'Artists & Groups', roles: 'Studio & stage', project: '[ADD CHOIR NAMES]', year: '', image: '', spotify_url: '', story: 'Victor has also worked with choirs and solo artists over the years.', visible: T, status: 'confirmed' },
      { order: 13, name: 'International artists (remote)', category: 'Mix & Master', roles: 'Mixing, Mastering', project: '[ADD ARTIST NAMES / COUNTRIES]', year: '', image: '', spotify_url: '', story: 'Artists outside Uganda who send their studio stems for mixing and mastering.', visible: T, status: 'confirmed' }
    ],

    BANDS: [
      { order: 1, name: '[ADD CURRENT BAND / PROJECT NAME]', relationship: 'Current', period: '[ADD YEAR] – present', role: '[ADD VICTOR’S ROLE]', description: '[ADD WHAT THE BAND IS DOING NOW]', members: '[ADD MEMBERS]', image: '[ADD BAND PHOTO]', is_current: T, visible: T, status: 'placeholder' },
      { order: 2, name: 'Anglican Youth Fellowship Band', relationship: 'Member', period: '1995 – [ADD END YEAR]', role: 'Instrumentalist [CONFIRM INSTRUMENT]', description: 'Victor’s turning point: playing alongside his cousin and first teacher Peter Kasamba, and meeting Arthur Mutesasira, who strengthened his keyboard playing.', members: 'Peter Kasamba, Arthur Mutesasira [ADD OTHERS]', image: '', is_current: false, visible: T, status: 'confirmed' },
      { order: 3, name: 'Qwela Band', relationship: 'Live Sound Engineer', period: '[ADD YEARS]', role: 'Live sound', description: '', members: '', image: '', is_current: false, visible: T, status: 'confirmed' },
      { order: 4, name: 'Zauka', relationship: 'Live Sound Engineer', period: '[ADD YEARS]', role: 'Live sound', description: '', members: '', image: '', is_current: false, visible: T, status: 'confirmed' },
      { order: 5, name: 'Soul Beat', relationship: 'Live Sound Engineer', period: '[ADD YEARS]', role: 'Live sound', description: '', members: '', image: '', is_current: false, visible: T, status: 'confirmed' },
      { order: 6, name: 'Code 9', relationship: 'Live Sound Engineer', period: '[ADD YEARS]', role: 'Live sound', description: '', members: '', image: '', is_current: false, visible: T, status: 'confirmed' }
    ],

    EVENTS: [
      { order: 1, title: 'Blankets & Wine', category: 'Festivals', date: '[ADD DATES]', location: '[ADD VENUE]', count: 3, people: '', description: 'Sound services at three editions.', image: '', visible: T, status: 'confirmed' },
      { order: 2, title: 'Roast & Rhyme', category: 'Festivals', date: '[ADD DATES]', location: '[ADD VENUE]', count: 2, people: '', description: 'Sound services at two editions.', image: '', visible: T, status: 'confirmed' },
      { order: 3, title: 'Home fellowships & church services', category: 'Church', date: '1991 – 1995', location: '', count: '', people: '', description: 'Where Victor first played guitar and piano for others.', image: '', visible: T, status: 'confirmed' },
      { order: 4, title: '[ADD CONCERT / EVENT]', category: 'Concerts', date: '[ADD DATE]', location: '[ADD LOCATION]', count: '', people: '[ADD PEOPLE]', description: '', image: '[ADD PHOTO]', visible: T, status: 'placeholder' }
    ],

    PHOTOS: [
      { order: 1, image: 'asset:portrait', alt: 'Portrait of Victor Uringtho, sepia-toned', caption: 'Victor Uringtho', category: 'Portrait', event: '', date: '[ADD DATE]', location: '', people: 'Victor Uringtho', visible: T, status: 'confirmed' },
      { order: 2, image: 'asset:casual', alt: 'Victor seated in the open door of a vehicle, smiling', caption: 'Between sessions', category: 'Behind the Music', event: '', date: '[ADD DATE]', location: '[ADD LOCATION]', people: 'Victor Uringtho', visible: T, status: 'needs-confirmation' },
      { order: 3, image: '[ADD STUDIO PHOTO]', alt: '', caption: '', category: 'Studio', event: '', date: '', location: '', people: '', visible: T, status: 'placeholder' },
      { order: 4, image: '[ADD LIVE SOUND / FOH PHOTO]', alt: '', caption: '', category: 'Live Sound', event: 'Blankets & Wine', date: '', location: '', people: '', visible: T, status: 'placeholder' }
    ],

    SKILLS: [
      { order: 1, group: 'Musicianship', skill: 'Guitar', evidence: 'Self-built first guitar; taught by Stephen and Peter Kasamba from 1986', visible: T, status: 'confirmed' },
      { order: 2, group: 'Musicianship', skill: 'Keyboard & piano', evidence: 'Learned from Patrick Kasamba; strengthened by Arthur Mutesasira', visible: T, status: 'confirmed' },
      { order: 3, group: 'Musicianship', skill: 'Drums', evidence: 'Explored during Senior Five & Six, 1993–95', visible: T, status: 'confirmed' },
      { order: 4, group: 'Musicianship', skill: 'Bass guitar', evidence: 'Explored during Senior Five & Six, 1993–95', visible: T, status: 'confirmed' },
      { order: 5, group: 'Musicianship', skill: 'Vocals', evidence: '[CONFIRM — not mentioned in the memoir]', visible: T, status: 'placeholder' },
      { order: 6, group: 'Writing & Arranging', skill: 'Songwriting', evidence: 'Writes music; own album “Thank You Lord” (2002)', visible: T, status: 'confirmed' },
      { order: 7, group: 'Writing & Arranging', skill: 'Arrangement', evidence: 'Arranges compositions for artists, bands and choirs', visible: T, status: 'confirmed' },
      { order: 8, group: 'Writing & Arranging', skill: 'Soundtrack creation', evidence: 'Built Zephaniah Mukalere’s backing tracks on a Roland XP-80', visible: T, status: 'confirmed' },
      { order: 9, group: 'Studio', skill: 'Music production', evidence: 'Producing since c. 2000', visible: T, status: 'confirmed' },
      { order: 10, group: 'Studio', skill: 'Rhythm programming', evidence: 'Studied in the United Kingdom', visible: T, status: 'confirmed' },
      { order: 11, group: 'Studio', skill: 'Recording', evidence: 'From four-track tape to the Akai DPS16 and beyond', visible: T, status: 'confirmed' },
      { order: 12, group: 'Studio', skill: 'Mixing & mastering', evidence: 'Including remote work for artists outside Uganda', visible: T, status: 'confirmed' },
      { order: 13, group: 'Live', skill: 'Live sound mixing', evidence: 'Qwela Band, Zauka, Soul Beat, Code 9; Blankets & Wine; Roast & Rhyme', visible: T, status: 'confirmed' },
      { order: 14, group: 'Live', skill: 'Live recording', evidence: 'Offers live recording services', visible: T, status: 'confirmed' },
      { order: 15, group: 'Artist care', skill: 'Listening & guidance', evidence: '“Listening, understanding an artist’s vision, offering guidance.”', visible: T, status: 'confirmed' },
      { order: 16, group: 'Artist care', skill: 'First-time artists', evidence: 'Works patiently with people recording for the first time', visible: T, status: 'confirmed' }
    ],

    PEOPLE: [
      { order: 1, name: 'Stephen Kasamba', relationship: 'Cousin · first teacher', contribution: 'Taught Victor his first chords — C, G7, F and D — and later bought him his first guitar in Germany.', image: '', visible: T, status: 'confirmed' },
      { order: 2, name: 'Peter Kasamba', relationship: 'Cousin · mentor', contribution: 'The Sunday-school guitarist who first inspired him; taught A, Am, B, Bm, E, Em and Dm; bandmate in the Anglican Youth Fellowship band.', image: '', visible: T, status: 'confirmed' },
      { order: 3, name: 'Patrick Kasamba', relationship: 'Cousin · keyboard exchange', contribution: 'Taught Victor keyboard in exchange for guitar lessons.', image: '', visible: T, status: 'confirmed' },
      { order: 4, name: 'Arthur Mutesasira', relationship: 'Mentor', contribution: 'Played an important role in shaping and strengthening Victor’s keyboard playing.', image: '', visible: T, status: 'confirmed' },
      { order: 5, name: 'Zephaniah Mukalere', relationship: 'First client', contribution: 'Believed Victor could produce his project; later brought back the Korg N264 and Akai DPS16 that expanded Victor’s studio.', image: '', visible: T, status: 'confirmed' }
    ],

    PROJECTS: [
      { order: 1, title: 'Production, mixing & mastering', type: 'Studio', stage: 'Ongoing', description: 'Working with artists in Uganda and remotely with artists abroad.', image: '', link: '', visible: T, status: 'confirmed' },
      { order: 2, title: 'Live sound & live recording', type: 'Live', stage: 'Ongoing', description: 'Mixing and recording performances so audiences hear music as it should be heard.', image: '', link: '', visible: T, status: 'confirmed' },
      { order: 3, title: 'Encouraging young musicians', type: 'Mentorship', stage: 'Ongoing', description: '“There are more young musicians to encourage.”', image: '', link: '', visible: T, status: 'confirmed' },
      { order: 4, title: '[ADD CURRENT BAND / NEW RECORDING]', type: '[ADD TYPE]', stage: 'In progress', description: '[ADD DESCRIPTION]', image: '[ADD PHOTO]', link: '', visible: T, status: 'placeholder' },
      { order: 5, title: '[ADD NEW MUSIC / UPCOMING RELEASE]', type: 'Release', stage: 'Coming soon', description: '', image: '', link: '[ADD SPOTIFY PRE-SAVE LINK]', visible: T, status: 'placeholder' }
    ],

    SERVICES: [
      { order: 1, service: 'Music production', description: 'From idea to finished record — arrangement, soundtracks and production.', visible: T, status: 'confirmed' },
      { order: 2, service: 'Recording', description: 'Vocals, instruments, bands and choirs.', visible: T, status: 'confirmed' },
      { order: 3, service: 'Mixing & mastering', description: 'Including remote work — send your stems from anywhere.', visible: T, status: 'confirmed' },
      { order: 4, service: 'Live sound', description: 'Front-of-house mixing and live recording for bands and events.', visible: T, status: 'confirmed' },
      { order: 5, service: 'Songwriting & arranging', description: 'Writing and arranging for artists, bands and choirs.', visible: T, status: 'confirmed' }
    ],

    SOCIAL_LINKS: [
      { order: 1, platform: 'Spotify', url: '[ADD SPOTIFY ARTIST LINK]', label: 'Listen on Spotify', visible: T, status: 'placeholder' },
      { order: 2, platform: 'YouTube', url: '[ADD YOUTUBE LINK]', label: 'Watch on YouTube', visible: T, status: 'placeholder' },
      { order: 3, platform: 'Instagram', url: '[ADD INSTAGRAM LINK]', label: 'Instagram', visible: T, status: 'placeholder' },
      { order: 4, platform: 'Facebook', url: '[ADD FACEBOOK LINK]', label: 'Facebook', visible: T, status: 'placeholder' },
      { order: 5, platform: 'TikTok', url: '[ADD TIKTOK LINK]', label: 'TikTok', visible: T, status: 'placeholder' },
      { order: 6, platform: 'SoundCloud', url: '[ADD SOUNDCLOUD LINK]', label: 'SoundCloud', visible: T, status: 'placeholder' }
    ],

    ENQUIRIES: []
  };
}
