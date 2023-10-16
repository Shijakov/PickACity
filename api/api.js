const makeRequest = async (query) => {
    const url = `https://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=${query}&format=application%2Fsparql-results%2Bjson&timeout=10000&signal_void=on&signal_unconnected=on`
    return fetch(url);
}

const getData = async (query) => {
    const response = await makeRequest(query);
    const data = await response.json();
    const result = data.results.bindings;
    return result.length == 1 ? result[0] : result;
}

export const getNumberCities = async () => {
    const query = `
    SELECT count(?city) as ?count
    WHERE {
        ?city rdf:type dbo:City;
        georss:point ?point.
    }
    `;
    const result = await getData(query);
    return result.count.value;
}

export const getCity = async (limit, offset) => {
    const query = `
    SELECT ?city ?point
    WHERE {
        ?city rdf:type dbo:City;
        georss:point ?point.
    }
    limit ${limit}
    offset ${offset}
    `;
    const result = await getData(query);
    return {
        city: result.city.value,
        point: result.point.value,
    };
}

export const getLandmarks = async (city) => {
    const finalCity = city.split('resource/')[1];
    const query = `https://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=SELECT+distinct+%3Fplace+%3Fpoint+%3Fabstract%0D%0AWHERE+%7B%0D%0A%3Fplace+a+owl%3AThing%3B%0D%0Ageorss%3Apoint+%3Fpoint%3B%0D%0Adbo%3Aabstract+%3Fabstract.%0D%0Aoptional+%7B%0D%0A%3Fplace+dbo%3Alocation+%3Floc1.%0D%0A%7D%0D%0Aoptional+%7B%0D%0A%3Fplace+dbp%3Alocation+%3Floc2.%0D%0A%7D%0D%0Afilter%28lang%28%3Fabstract%29%3D%27en%27%29.%0D%0Afilter%28+%28bound%28%3Floc1%29+%26%26+contains%28+str%28%3Floc1%29%2C+%27${finalCity}%27+%29%29+%7C%7C+%28bound%28%3Floc2%29+%26%26+contains%28+str%28%3Floc2%29%2C+%27${finalCity}%27+%29%29+%29.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=120000&signal_void=on&signal_unconnected=on`;
    const result = await getData(query);
    return result.map(item => ({
        place: item.place.value,
        point: item.point.value,
        abstract: item.abstract.value,
    }));
}

export const getAbstract = async (name) => {
    const query = `
    select ?abstract
    where {
    [] dbp:name  "${name}"@en;
    dbo:abstract ?abstract.
    filter(lang(?abstract)="en")
    }
    limit 1
    `;
    const result = await getData(query);
    if (Array.isArray(result)) {
        return null;
    }
    return result.abstract.value;
}