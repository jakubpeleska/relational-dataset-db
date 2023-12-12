import React from 'react';
import DocumentTitle from 'react-document-title';
import Component from '../common/component.react';

require('./aboutPage.styl');

export default class AboutPage extends Component {

  render() {
    return (
      <DocumentTitle title='About'>
        <section className='content'>
          <section className='About-section'>
            <h2>Mission</h2>
            <p>
              To support the growth of relational machine learning.
            </p>
          </section>

          <section className='About-section'>
            <h2>How to cite</h2>
            <p>
              Cite <a href="http://arxiv.org/abs/1511.03086">this article</a>.
            </p>
          </section>

          <section className='About-section'>
            <h2>FAQ</h2>
            <dl className='About-faq'>
              <dt>Why are the datasets not stored in CSV files?</dt>
              <dd>
                Because CSV files do not store information about data types, PKs, FKs and other constraints.
              </dd>

              <dt>Why MariaDB database?</dt>
              <dd>
                Because in combination with <a href="http://clowdflows.org">ClowdFlows</a> you can process the datasets online. <br />
                Just open one of the public workflows (like <a href="http://clowdflows.org/workflows/copy-workflow/2222">Wordification</a> or <a href="http://clowdflows.com/workflow/4018">Cross-validation</a>), change the credentials in "MySQL Connect" operator to the credentials from the repository and you are ready to go!
              </dd>

              <dt>Why am I not able to connect to the database?</dt>
              <dd>
                If you are connecting to the database over a corporate network, the corporate firewalls could be the culprit (it may block port 3306). <br />
                Try to access the database with a different internet provider (e.g. with your cellular provider). <br />
                Also, keep in mind that database names are case sensitive. Database "mutagenesis" is not the same database as "Mutagenesis". <br />
                If the problems persist, contact us and provide us with the following information: <ol>
                  <li>Your database client and its version (e.g. MySQL Workbench 6.3.10).</li>
                  <li>The database name you tried to connect to (e.g. mutagenesis).</li>
                  </ol>
              </dd>

              <dt>Why MySQL Workbench complaints about incompatible/nonstandard server version?</dt>
              <dd>
                We are using open source version of MySQL called MariaDB, hence the warning. For all purposes that the public account permits it is safe to ignore the message.
              </dd>

              <dt>Why mysqldump cannot find COLUMN_STATISTICS in information_schema?</dt>
              <dd>
                MariaDB has the table in MYSQL.COLUMNM_STATS. Use one of the <a href="https://serverfault.com/questions/912162/mysqldump-throws-unknown-table-column-statistics-in-information-schema-1109">workarounds</a>.
              </dd>

              <dt>What to do if I want an ILP format?</dt>
              <dd>
                See a collection of datasets at <a href="http://www-ai.ijs.si/~ilpnet2/apps/index.html">ILPnet2</a>. <br />
                Or use a conversion <a href="http://www2.cs.sfu.ca/~oschulte/jbn/DataConversion/MLN.html">tool</a>, where you have to change the connection parameters in <code>src/Read.java</code> from:  <br />
                  <code>
                  &emsp; read.setConnection("jdbc:mysql://mantong01.dyndns.org:3306/mln","temp","Passw0rd");
                  </code> <br />
                to:  <br />
                  <code>
                  &emsp; read.setConnection("jdbc:mysql://relational.fit.cvut.cz:3306/mutagenesis","guest","relational");
                  </code> <br />
              </dd>

              <dt>Why do the datasets contain missing values/composite keys/strange data types/any other ugly thing you may think of?</dt>
              <dd>
                Because they are also present in the real datasets.
              </dd>

              <dt>What is the point of including artificial datasets?</dt>
              <dd>
                While datasets like Adventure Works may not contain any pattern that could be found during modeling, they still increase the diversity of the repository. For example, the named Adventure Works dataset has the highest table count in the whole repository. <br />
                If your algorithm can process all the tables present in Adventure Works, it may be able to process real-world datasets.
              </dd>
            </dl>
          </section>

          <section className='About-section'>
            <h2>Tools that use our repository</h2>
            <p>
              <a href="https://www.cynkra.com/blog/2020-04-02-dm/">dm: Relational Data Models</a>, a package for working with relational data in R. <br />
              <a href="https://data-xtractor.com/blog/case-study/connect-to-public-datasets/">Data Xtractor</a>, a visual SQL query builder for Windows. <br />
              <a href="https://docs.getml.com/0.10.0/tutorial/loans/loans.html">getML</a>, a propositionalization library in Python.
            </p>
          </section>
        </section>
      </DocumentTitle>
    );
  }

}
