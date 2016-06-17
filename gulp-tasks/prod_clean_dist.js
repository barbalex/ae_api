'use strict'

const gulp = require('gulp')
const del = require('del')

gulp.task('prod_clean_dist', function (cb) {
  del(['dist'], cb)
})
