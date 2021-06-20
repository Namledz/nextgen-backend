/**
 * FastqQCController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const cheerio = require('cheerio');
const fs = require('fs')
module.exports = {
    getFastqQC: async (req, res) => {
        // let html = await fs.readFileSync('/var/www/data/sample1/multiqc_report.html')
        // let $ = cheerio.load('/var/www/data/sample1/snpEff_summary.html');
        // let data = $('#general_stats').html();
        // let data = $('a[name="changesByType"]').html();
        fs.readFile('/var/www/data/sample1/multiqc_report.html', function (error, html) {
            if (error) {
                throw error;
            }

            let $ = cheerio.load(html);
            let head = $('head').html();
            // let body = $('body').html()
            let stat1 = $('#general_stats').html()
            let stat2 = `    <div class="mqc-section mqc-section-fastqc">
          
            <h3 id="fastqc_per_sequence_quality_scores">
                Per Sequence Quality Scores
                
                  <button class="btn btn-default btn-sm pull-right" type="button" data-toggle="collapse" data-target="#fastqc_per_sequence_quality_scores_helptext" aria-expanded="false" aria-controls="fastqc_per_sequence_quality_scores_helptext">
                    <span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span>
                    Help
                  </button>
                
            </h3>
          
          <div class="mqc-section-description"><p>The number of reads with average quality scores. Shows if a subset of reads has poor quality.</p></div>
          
          
            <div class="collapse mqc-section-helptext " id="fastqc_per_sequence_quality_scores_helptext">
              <div class="well"><p>From the <a href="http://www.bioinformatics.babraham.ac.uk/projects/fastqc/Help/3%20Analysis%20Modules/3%20Per%20Sequence%20Quality%20Scores.html">FastQC help</a>:</p>
<p><em>The per sequence quality score report allows you to see if a subset of your
sequences have universally low quality values. It is often the case that a
subset of sequences will have universally poor quality, however these should
represent only a small percentage of the total sequences.</em></p></div>
            </div>
          
          <div class="mqc-section-plot"><div class="mqc_hcplot_plotgroup"><div class="hc-plot-wrapper"><div id="fastqc_per_sequence_quality_scores_plot" class="hc-plot not_rendered hc-line-plot"><small>loading..</small></div></div></div> 
</div>
          
          <hr>
        </div>`
            let stat3 = `
        <div class="mqc-section mqc-section-fastqc">
          
            <h3 id="fastqc_sequence_duplication_levels">
                Sequence Duplication Levels
                
                  <button class="btn btn-default btn-sm pull-right" type="button" data-toggle="collapse" data-target="#fastqc_sequence_duplication_levels_helptext" aria-expanded="false" aria-controls="fastqc_sequence_duplication_levels_helptext">
                    <span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span>
                    Help
                  </button>
                
            </h3>
          
          <div class="mqc-section-description"><p>The relative level of duplication found for every sequence.</p></div>
          
          
            <div class="collapse mqc-section-helptext " id="fastqc_sequence_duplication_levels_helptext">
              <div class="well"><p>From the <a href="http://www.bioinformatics.babraham.ac.uk/projects/fastqc/Help/3%20Analysis%20Modules/8%20Duplicate%20Sequences.html">FastQC Help</a>:</p>
<p><em>In a diverse library most sequences will occur only once in the final set.
A low level of duplication may indicate a very high level of coverage of the
target sequence, but a high level of duplication is more likely to indicate
some kind of enrichment bias (eg PCR over amplification). This graph shows
the degree of duplication for every sequence in a library: the relative
number of sequences with different degrees of duplication.</em></p>
<p><em>Only sequences which first appear in the first 100,000 sequences
in each file are analysed. This should be enough to get a good impression
for the duplication levels in the whole file. Each sequence is tracked to
the end of the file to give a representative count of the overall duplication level.</em></p>
<p><em>The duplication detection requires an exact sequence match over the whole length of
the sequence. Any reads over 75bp in length are truncated to 50bp for this analysis.</em></p>
<p><em>In a properly diverse library most sequences should fall into the far left of the
plot in both the red and blue lines. A general level of enrichment, indicating broad
oversequencing in the library will tend to flatten the lines, lowering the low end
and generally raising other categories. More specific enrichments of subsets, or
the presence of low complexity contaminants will tend to produce spikes towards the
right of the plot.</em></p></div>
            </div>
          
          <div class="mqc-section-plot"><div class="mqc_hcplot_plotgroup"><div class="hc-plot-wrapper"><div id="fastqc_sequence_duplication_levels_plot" class="hc-plot not_rendered hc-line-plot"><small>loading..</small></div></div></div> 
</div>
          
          <hr>
        </div>
        `
            let data = head + stat1 + stat2 + stat3

            fs.writeFile('output.html', data, (err) => {
                // throws an error, you could also catch it here
                if (err) throw err;

                // success case, the file was saved
                // console.log('file saved!');
            });
            return res.json(data)
        });
    }

};

